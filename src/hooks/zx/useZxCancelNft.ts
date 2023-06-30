import { recordError } from 'core/libs/logger'
import postTxStore from 'core/store/postTxStore'
import { FbListing, PostTxStatus, SupportedNetworkEnum } from 'core/types'
import { SignedNftOrderV4Serialized } from 'evm-nft-swap'
import useFsChannel from 'hooks/firestore/useFsChannel'
import useFsListing from 'hooks/firestore/useFsListing'
import { useSetRecoilState } from 'recoil'

import firestore from '@react-native-firebase/firestore'

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
          await firestore()
            .collection('channels')
            .doc(channelUrl)
            .collection('listings')
            .doc(order.nonce)
            .update({ status: 'cancelled' } as Partial<FbListing>)
        }
        if (fsListing) {
          await fsListing.update({ status: 'cancelled' } as Partial<FbListing>)
        }
      } catch (e) {
        recordError(e, 'useZxCancelNft:fsChannel.collection(listings).update')
      }
    }
  }
  return { onClickConfirm }
}

export default useZxCancelNft
