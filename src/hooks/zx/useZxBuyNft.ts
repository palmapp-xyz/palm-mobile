import { recordError } from 'core/libs/logger'
import postTxStore from 'core/store/postTxStore'
import {
  FbListing,
  PostTxStatus,
  SupportedNetworkEnum,
  TrueOrErrReturn,
} from 'core/types'
import { ethers } from 'ethers'
import { SignedNftOrderV4Serialized } from 'evm-nft-swap'
import useFsChannel from 'hooks/firestore/useFsChannel'
import useFsListing from 'hooks/firestore/useFsListing'
import _ from 'lodash'
import { useSetRecoilState } from 'recoil'

import useZx from './useZx'

export type UseZxBuyNftReturn = {
  onClickConfirm: ({
    order,
  }: {
    order: SignedNftOrderV4Serialized
  }) => Promise<TrueOrErrReturn>
}

const useZxBuyNft = (
  channelUrl: string,
  nonce: string,
  chain: SupportedNetworkEnum
): UseZxBuyNftReturn => {
  const { nftSwapSdk } = useZx(chain)
  const setPostTxResult = useSetRecoilState(postTxStore.postTxResult)

  const { fsChannel } = useFsChannel({ channelUrl })
  const { fsListing } = useFsListing({ nonce })

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
          if (fsChannel) {
            // add the new listing item to the corresponding channel doc firestore
            await fsChannel
              .collection('listings')
              .doc(order.nonce)
              .update({ status: 'completed' } as Partial<FbListing>)
          }
          if (fsListing) {
            await fsListing.update({
              status: 'completed',
            } as Partial<FbListing>)
          }
        } catch (e) {
          recordError(e, 'useZxBuyNft:fsChannel.collection(listings).update')
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
