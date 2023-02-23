import useZx from './useZx'

export type UseZxCancelNftReturn = {
  onClickConfirm: ({ nonce }: { nonce: string }) => Promise<void>
}

const useZxCancelNft = (): UseZxCancelNftReturn => {
  const { nftSwapSdk } = useZx()

  const onClickConfirm = async ({
    nonce,
  }: {
    nonce: string
  }): Promise<void> => {
    if (nftSwapSdk) {
      const fillTx = await nftSwapSdk.cancelOrder(nonce, 'ERC721')
      console.log(fillTx)
      const txReceipt = await fillTx.wait()
      console.log(txReceipt)
    }
  }
  return { onClickConfirm }
}

export default useZxCancelNft
