import {
  SignedNftOrderV4,
  SignedNftOrderV4Serialized,
  UserFacingERC20AssetDataSerializedV4,
  UserFacingERC721AssetDataSerializedV4,
} from 'evm-nft-swap'
import { PostOrderResponsePayload } from 'evm-nft-swap/dist/sdk/v4/orderbook'
import _ from 'lodash'
import { setDoc } from 'palm-core/firebase'
import { channelListingRef } from 'palm-core/firebase/channel'
import { listingRef } from 'palm-core/firebase/listing'
import { UTIL } from 'palm-core/libs'
import { Routes } from 'palm-core/libs/navigation'
import { serializeNftOrder } from 'palm-core/libs/zx'
import {
  ContractAddr,
  FbListing,
  PostTxStatus,
  QueryKeyEnum,
  SupportedNetworkEnum,
  Token,
} from 'palm-core/types'
import { useAppNavigation } from 'palm-react/hooks/app/useAppNavigation'
import useAuth from 'palm-react/hooks/auth/useAuth'
import useReactQuery from 'palm-react/hooks/complex/useReactQuery'
import useFsChannel from 'palm-react/hooks/firestore/useFsChannel'
import postTxStore from 'palm-react/store/postTxStore'
import { useMemo, useState } from 'react'
import { useSetRecoilState } from 'recoil'

import useZx from './useZx'

export type UseZxListNftReturn = {
  isApproved: boolean
  onClickApprove: () => Promise<void>
  onClickConfirm: () => Promise<SignedNftOrderV4Serialized | undefined>
  price: Token
  setPrice: (value: Token) => void
}

const useZxListNft = ({
  nftContract,
  tokenId,
  chain,
  channelUrl,
}: {
  nftContract: ContractAddr
  tokenId: string
  chain: SupportedNetworkEnum
  channelUrl: string
}): UseZxListNftReturn => {
  const { navigation } = useAppNavigation()
  const { nftSwapSdk } = useZx(chain)
  const setPostTxResult = useSetRecoilState(postTxStore.postTxResult)

  const { user } = useAuth()
  const [price, setPrice] = useState<Token>('' as Token)

  const { fsChannel } = useFsChannel({ channelUrl })

  const nftToSwap = useMemo(
    () =>
      ({
        tokenAddress: nftContract as string,
        tokenId,
        type: 'ERC721',
      } as UserFacingERC721AssetDataSerializedV4),
    [nftContract, tokenId]
  )

  const priceOfNft = useMemo(
    () =>
      ({
        tokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        amount: UTIL.microfyP(price),
        type: 'ERC20',
      } as UserFacingERC20AssetDataSerializedV4),
    [price]
  )

  const { data: isApproved = false, refetch: refetchIsApprove } = useReactQuery(
    [QueryKeyEnum.NFT_APPROVED, nftContract, user?.address, chain],
    async () => {
      if (user && nftSwapSdk) {
        return (await nftSwapSdk.loadApprovalStatus(nftToSwap, user.address))
          .contractApproved
      }
    },
    {
      enabled: !!user?.address,
    }
  )

  const onClickApprove = async (): Promise<void> => {
    if (user && nftSwapSdk) {
      try {
        setPostTxResult({
          status: PostTxStatus.POST,
          chain,
        })
        const approvalTx = await nftSwapSdk.approveTokenOrNftByAsset(
          nftToSwap,
          user.address
        )
        setPostTxResult({
          status: PostTxStatus.BROADCAST,
          transactionHash: approvalTx.hash,
          chain,
        })

        const approvalTxReceipt = await approvalTx.wait()
        setPostTxResult({
          status: PostTxStatus.DONE,
          value: approvalTxReceipt,
          chain,
        })
      } catch (error) {
        setPostTxResult({
          status: PostTxStatus.ERROR,
          chain,
          error,
        })
      }
      refetchIsApprove()
    }
  }

  const postOrder = async (
    signedOrder: SignedNftOrderV4
  ): Promise<PostOrderResponsePayload | undefined> => {
    if (nftSwapSdk && fsChannel) {
      const postedOrder: PostOrderResponsePayload =
        chain !== SupportedNetworkEnum.KLAYTN
          ? await nftSwapSdk.postOrder(signedOrder, nftSwapSdk.chainId)
          : {
              order: serializeNftOrder(signedOrder),
              erc20Token: signedOrder.erc20Token,
              erc20TokenAmount: signedOrder.erc20TokenAmount.toString(),
              nftToken: nftToSwap.tokenAddress,
              nftTokenId: nftToSwap.tokenId,
              nftTokenAmount: '1',
              nftType: nftToSwap.type,
              sellOrBuyNft: 'sell',
              chainId: _.toString(nftSwapSdk.chainId),
              metadata: {},
            }

      const listing: FbListing = {
        nftContract: nftToSwap.tokenAddress as ContractAddr,
        tokenId: nftToSwap.tokenId,
        order: postedOrder,
        status: 'active',
        channelUrl,
      }

      // add the new listing item to the corresponding channel doc firestore
      await setDoc(
        channelListingRef(channelUrl, postedOrder.order.nonce),
        listing
      )
      // also add to listings collection for keeping track of listed channels for the nft
      await setDoc(listingRef(postedOrder.order.nonce), listing)
      return postedOrder
    }

    return undefined
  }

  const onClickConfirm = async (): Promise<
    SignedNftOrderV4Serialized | undefined
  > => {
    if (user && nftSwapSdk) {
      try {
        setPostTxResult({
          status: PostTxStatus.POST,
          chain,
        })
        const order = nftSwapSdk.buildOrder(nftToSwap, priceOfNft, user.address)

        // Sign the order (User A signs since they are initiating the trade)
        const signedOrder: SignedNftOrderV4 = await nftSwapSdk.signOrder(order)

        console.log('signedOrder', JSON.stringify(signedOrder, null, 2))

        const postedOrder: PostOrderResponsePayload | undefined =
          await postOrder(signedOrder)

        console.log(JSON.stringify(postedOrder, null, 2))

        setPostTxResult({
          status: PostTxStatus.DONE,
          chain,
        })
        navigation.replace(Routes.ZxNftDetail, {
          nonce: postedOrder!.order.nonce,
          chain,
          channelUrl,
        })

        return postedOrder!.order
      } catch (error) {
        setPostTxResult({
          status: PostTxStatus.ERROR,
          error,
          chain,
        })
      }
    }
    return undefined
  }
  return { onClickApprove, onClickConfirm, isApproved, price, setPrice }
}

export default useZxListNft
