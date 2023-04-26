import { useSetRecoilState } from 'recoil'
import _ from 'lodash'

import useAuth from 'hooks/auth/useAuth'
import postTxStore from 'store/postTxStore'

import {
  ContractAddr,
  EncodedTxData,
  PostTxReturn,
  PostTxStatus,
  SupportedNetworkEnum,
  pToken,
} from 'types'
import useWeb3 from './useWeb3'
import { getPkey } from 'libs/account'

type UsePostTxReturn = {
  postTx: (props: {
    data?: EncodedTxData
    nativeToken?: pToken
  }) => Promise<PostTxReturn>
}

export const usePostTx = ({
  contractAddress,
  chain,
}: {
  contractAddress: ContractAddr
  chain: SupportedNetworkEnum
}): UsePostTxReturn => {
  const { user } = useAuth()
  const { web3 } = useWeb3(chain)
  const setPostTxResult = useSetRecoilState(postTxStore.postTxResult)

  const postTx = async ({
    data,
    nativeToken,
  }: {
    data?: EncodedTxData
    nativeToken?: pToken
  }): Promise<PostTxReturn> => {
    if (_.isEmpty(data)) {
      const message = 'Post data is empty'
      return {
        success: false,
        message,
      }
    }

    setPostTxResult({ status: PostTxStatus.POST, chain })
    if (user) {
      try {
        const userAddress = user.address
        const pkey = await getPkey()
        const account = web3.eth.accounts.privateKeyToAccount(pkey)
        web3.eth.accounts.wallet.add(account)

        const receipt = await web3.eth
          .sendTransaction({
            from: userAddress,
            to: contractAddress,
            gas: '2000000',
            data,
            value: nativeToken,
          })
          .on('transactionHash', function (transactionHash) {
            setPostTxResult({
              status: PostTxStatus.BROADCAST,
              transactionHash,
              chain,
            })
          })

        setPostTxResult({
          status: PostTxStatus.DONE,
          value: receipt,
          chain,
        })
        return {
          success: true,
          receipt,
        }
      } catch (error: any) {
        setPostTxResult({
          status: PostTxStatus.ERROR,
          error: error?.message ? error.message : JSON.stringify(error),
          chain,
        })
        return {
          success: false,
          message: _.toString(error),
          error,
        }
      }
    } else {
      const message = 'Not logged in'
      setPostTxResult({ status: PostTxStatus.ERROR, error: message, chain })
      return {
        success: false,
        message,
      }
    }
  }

  return { postTx }
}

export default usePostTx
