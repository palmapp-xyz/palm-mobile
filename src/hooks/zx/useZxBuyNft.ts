import { ethers } from 'ethers'
import { SignedNftOrderV4Serialized } from 'evm-nft-swap'
import useFsChannel from 'hooks/firestore/useFsChannel'
import useFsListing from 'hooks/firestore/useFsListing'
import _ from 'lodash'
import { updateDoc } from 'palm-core/firebase'
import { channelListingRef } from 'palm-core/firebase/channel'
import { recordError } from 'palm-core/libs/logger'
import {
  PostTxStatus,
  SupportedNetworkEnum,
  TrueOrErrReturn,
} from 'palm-core/types'
import postTxStore from 'palm-react/store/postTxStore'
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
            await updateDoc(channelListingRef(channelUrl, order.nonce), {
              status: 'completed',
            })
          }
          if (fsListing) {
            await updateDoc(fsListing, {
              status: 'completed',
            })
          }
        } catch (e) {
          recordError(e, 'useZxBuyNft:updateDoc')
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
