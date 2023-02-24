import { useSetRecoilState } from 'recoil'
import postTxStore from 'store/postTxStore'
import { PostTxStatus, zx } from 'types'
import useZx from './useZx'

export type UseZxBuyNftReturn = {
  onClickConfirm: ({ order }: { order: zx.order['order'] }) => Promise<void>
}

const useZxBuyNft = (): UseZxBuyNftReturn => {
  const { nftSwapSdk } = useZx()
  const setPostTxResult = useSetRecoilState(postTxStore.postTxResult)

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
        const fillTx = await nftSwapSdk.fillSignedOrder(order)
        setPostTxResult({
          status: PostTxStatus.BROADCAST,
          transactionHash: fillTx.hash,
        })

        const txReceipt = await fillTx.wait()
        setPostTxResult({
          status: PostTxStatus.DONE,
          value: txReceipt,
        })
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
