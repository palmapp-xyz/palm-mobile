import { ethers } from 'ethers'
import { useSetRecoilState } from 'recoil'
import firestore from '@react-native-firebase/firestore'

import { useSendbirdChat } from '@sendbird/uikit-react-native'
import { useGroupChannel } from '@sendbird/uikit-chat-hooks'

import postTxStore from 'store/postTxStore'
import { PostTxStatus, zx } from 'types'
import useZx from './useZx'

export type UseZxBuyNftReturn = {
  onClickConfirm: ({ order }: { order: zx.order['order'] }) => Promise<void>
}

const useZxBuyNft = (channelUrl: string): UseZxBuyNftReturn => {
  const { nftSwapSdk } = useZx()
  const setPostTxResult = useSetRecoilState(postTxStore.postTxResult)

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, channelUrl)

  const onClickConfirm = async ({
    order,
  }: {
    order: zx.order['order']
  }): Promise<void> => {
    if (nftSwapSdk) {
      try {
        setPostTxResult({
          status: PostTxStatus.POST,
        })
        const fillTx = await nftSwapSdk.fillSignedOrder(order, undefined, {
          gasLimit: 8000000,
          gasPrice: ethers.utils.parseUnits('90', 'gwei'),
        })
        setPostTxResult({
          status: PostTxStatus.BROADCAST,
          transactionHash: fillTx.hash,
        })

        const txReceipt = await fillTx.wait()
        setPostTxResult({
          status: PostTxStatus.DONE,
          value: txReceipt,
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
            .doc(order.erc721Token)
            .collection('orders')
            .doc(order.nonce)
            .set({ status: 'completed' })
        } catch (e) {
          console.error(e)
        }
      } catch (error) {
        setPostTxResult({
          status: PostTxStatus.ERROR,
          error,
        })
      }
    }
  }
  return { onClickConfirm }
}

export default useZxBuyNft
