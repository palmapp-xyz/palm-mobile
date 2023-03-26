import { ethers } from 'ethers'
import { useSetRecoilState } from 'recoil'
import firestore from '@react-native-firebase/firestore'

import { useSendbirdChat } from '@sendbird/uikit-react-native'
import { useGroupChannel } from '@sendbird/uikit-chat-hooks'

import postTxStore from 'store/postTxStore'
import { PostTxStatus, SupportedNetworkEnum, TrueOrErrReturn } from 'types'
import useZx from './useZx'
import _ from 'lodash'
import { SignedNftOrderV4Serialized } from 'evm-nft-swap'
import { getOrderTokenAddress } from 'libs/zx'

export type UseZxBuyNftReturn = {
  onClickConfirm: ({
    order,
  }: {
    order: SignedNftOrderV4Serialized
  }) => Promise<TrueOrErrReturn>
}

const useZxBuyNft = (
  channelUrl: string,
  chain: SupportedNetworkEnum
): UseZxBuyNftReturn => {
  const { nftSwapSdk } = useZx(chain)
  const setPostTxResult = useSetRecoilState(postTxStore.postTxResult)

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, channelUrl)

  const onClickConfirm = async ({
    order,
  }: {
    order: SignedNftOrderV4Serialized
  }): Promise<TrueOrErrReturn> => {
    if (nftSwapSdk) {
      try {
        setPostTxResult({
          status: PostTxStatus.POST,
          chain: SupportedNetworkEnum.ETHEREUM,
        })
        const fillTx = await nftSwapSdk.fillSignedOrder(order, undefined, {
          gasLimit: 8000000,
          gasPrice: ethers.utils.parseUnits('90', 'gwei'),
        })
        setPostTxResult({
          status: PostTxStatus.BROADCAST,
          transactionHash: fillTx.hash,
          chain: SupportedNetworkEnum.ETHEREUM,
        })

        const txReceipt = await fillTx.wait()
        setPostTxResult({
          status: PostTxStatus.DONE,
          value: txReceipt,
          chain: SupportedNetworkEnum.ETHEREUM,
        })

        try {
          if (channel) {
            // add the new listing item to the corresponding channel doc firestore
            await firestore()
              .collection('channels')
              .doc(channel.url)
              .collection('listings')
              .doc(order.nonce)
              .set({ status: 'completed' })
          }
          await firestore()
            .collection('listings')
            .doc(getOrderTokenAddress(order))
            .collection('orders')
            .doc(order.nonce)
            .set({ status: 'completed' })
        } catch (e) {
          console.error(e)
        }
        return { success: true, value: '' }
      } catch (error) {
        setPostTxResult({
          status: PostTxStatus.ERROR,
          error,
          chain: SupportedNetworkEnum.ETHEREUM,
        })
        return { success: false, errMsg: _.toString(error) }
      }
    }
    return { success: false, errMsg: 'No swap sdk' }
  }
  return { onClickConfirm }
}

export default useZxBuyNft
