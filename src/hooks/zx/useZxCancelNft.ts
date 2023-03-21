import firestore from '@react-native-firebase/firestore'

import { useSendbirdChat } from '@sendbird/uikit-react-native'
import { useGroupChannel } from '@sendbird/uikit-chat-hooks'

import { useSetRecoilState } from 'recoil'
import postTxStore from 'store/postTxStore'
import { PostTxStatus, SupportedNetworkEnum, zx } from 'types'
import useZx from './useZx'

export type UseZxCancelNftReturn = {
  onClickConfirm: ({ order }: { order: zx.order['order'] }) => Promise<void>
}

const useZxCancelNft = (channelUrl: string): UseZxCancelNftReturn => {
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
      setPostTxResult({
        status: PostTxStatus.POST,
        chain: SupportedNetworkEnum.ETHEREUM,
      })
      const fillTx = await nftSwapSdk.cancelOrder(order.nonce, 'ERC721')
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
          await firestore()
            .collection('channels')
            .doc(channel.url)
            .collection('listings')
            .doc(order.nonce)
            .update({ status: 'cancelled' })
        }
        await firestore()
          .collection('listings')
          .doc(order.erc721Token)
          .collection('orders')
          .doc(order.nonce)
          .update({ status: 'cancelled' })
      } catch (e) {
        console.error(e)
      }
    }
  }
  return { onClickConfirm }
}

export default useZxCancelNft
