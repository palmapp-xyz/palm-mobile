import { useSetRecoilState } from 'recoil'
import postTxStore from 'store/postTxStore'
import { PostTxStatus } from 'types'
import useZx from './useZx'

export type UseZxCancelNftReturn = {
  onClickConfirm: ({ nonce }: { nonce: string }) => Promise<void>
}

const useZxCancelNft = (): UseZxCancelNftReturn => {
  const { nftSwapSdk } = useZx()
  const setPostTxResult = useSetRecoilState(postTxStore.postTxResult)

  const onClickConfirm = async ({
    nonce,
  }: {
    nonce: string
  }): Promise<void> => {
    if (nftSwapSdk) {
      setPostTxResult({
        status: PostTxStatus.POST,
      })
      const fillTx = await nftSwapSdk.cancelOrder(nonce, 'ERC721')
      setPostTxResult({
        status: PostTxStatus.BROADCAST,
        transactionHash: fillTx.hash,
      })

      const txReceipt = await fillTx.wait()
      setPostTxResult({
        status: PostTxStatus.DONE,
        value: txReceipt,
      })
    }
  }
  return { onClickConfirm }
}

export default useZxCancelNft
