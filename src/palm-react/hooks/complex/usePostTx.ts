import _ from 'lodash'
import { UTIL } from 'palm-core/libs'
import {
  ContractAddr,
  EncodedTxData,
  PostTxReturn,
  PostTxStatus,
  pToken,
  SupportedNetworkEnum,
} from 'palm-core/types'
import PkeyManager from 'palm-react-native/app/pkeyManager'
import useAuth from 'palm-react/hooks/auth/useAuth'
import postTxStore from 'palm-react/store/postTxStore'
import { useSetRecoilState } from 'recoil'

import useWeb3 from './useWeb3'

type UsePostTxReturn = {
  getTxFee: (props: {
    data?: EncodedTxData
    to?: ContractAddr
    value?: pToken
  }) => Promise<pToken>
  postTx: (props: {
    data?: EncodedTxData
    to?: ContractAddr
    value?: pToken
  }) => Promise<PostTxReturn>
}

const gas = '300000'

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

  const getTxFee = async ({
    data,
    to,
    value,
  }: {
    data?: EncodedTxData
    to?: ContractAddr
    value?: pToken
  }): Promise<pToken> => {
    if (user) {
      const estimated = await web3.eth.estimateGas({
        from: user.address,
        to: to ?? contractAddress,
        gas,
        data: to ? undefined : data,
        value,
      })
      const price = await web3.eth.getGasPrice()
      return UTIL.toBn(estimated).multipliedBy(price).toString(10) as pToken
    }
    return '0' as pToken
  }

  const postTx = async ({
    data,
    to,
    value,
  }: {
    data?: EncodedTxData
    to?: ContractAddr
    value?: pToken
  }): Promise<PostTxReturn> => {
    if (!to && _.isEmpty(data)) {
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
        const pkey = await PkeyManager.getPkey()
        const account = web3.eth.accounts.privateKeyToAccount(pkey)
        web3.eth.accounts.wallet.add(account)

        const receipt = await web3.eth
          .sendTransaction({
            from: userAddress,
            to: to ?? contractAddress,
            gas,
            data: to ? undefined : data,
            value,
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

  return { getTxFee, postTx }
}

export default usePostTx
