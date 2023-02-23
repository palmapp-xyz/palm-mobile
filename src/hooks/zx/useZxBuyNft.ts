import { zx } from 'types'
import useZx from './useZx'

export type UseZxBuyNftReturn = {
  onClickConfirm: ({ order }: { order: zx.order }) => Promise<void>
}

const useZxBuyNft = (): UseZxBuyNftReturn => {
  const { nftSwapSdk } = useZx()

  const onClickConfirm = async ({
    order,
  }: {
    order: zx.order
  }): Promise<void> => {
    if (nftSwapSdk) {
      const fillTx = await nftSwapSdk.fillSignedOrder(order.order)
      console.log(fillTx)
      const txReceipt = await fillTx.wait()
      console.log(txReceipt)
    }
  }
  return { onClickConfirm }
}

export default useZxBuyNft
