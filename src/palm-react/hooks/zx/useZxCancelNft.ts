import { SignedNftOrderV4Serialized } from 'evm-nft-swap'
import { updateDoc } from 'palm-core/firebase'
import { channelListingRef } from 'palm-core/firebase/channel'
import { recordError } from 'palm-core/libs/logger'
import { PostTxStatus, SupportedNetworkEnum } from 'palm-core/types'
import useFsChannel from 'palm-react/hooks/firestore/useFsChannel'
import useFsListing from 'palm-react/hooks/firestore/useFsListing'
import postTxStore from 'palm-react/store/postTxStore'
import { useSetRecoilState } from 'recoil'

import useZx from './useZx'

export type UseZxCancelNftReturn = {
  onClickConfirm: ({
    order,
  }: {
    order: SignedNftOrderV4Serialized
  }) => Promise<void>
}

const useZxCancelNft = (
  channelUrl: string,
  nonce: string,
  chain: SupportedNetworkEnum
): UseZxCancelNftReturn => {
  const { nftSwapSdk } = useZx(chain)
  const setPostTxResult = useSetRecoilState(postTxStore.postTxResult)

  const { fsChannel } = useFsChannel({ channelUrl })
  const { fsListing } = useFsListing({ nonce })

  const onClickConfirm = async ({
    order,
  }: {
    order: SignedNftOrderV4Serialized
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
        if (fsChannel) {
          await updateDoc(channelListingRef(channelUrl, order.nonce), {
            status: 'cancelled',
          })
        }
        if (fsListing) {
          await updateDoc(fsListing, {
            status: 'cancelled',
          })
        }
      } catch (e) {
        recordError(e, 'useZxCancelNft:updateDoc')
      }
    }
  }
  return { onClickConfirm }
}

export default useZxCancelNft
