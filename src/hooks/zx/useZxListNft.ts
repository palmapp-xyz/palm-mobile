import { UTIL } from 'consts'
import {
  SignedNftOrderV4,
  SignedNftOrderV4Serialized,
  UserFacingERC20AssetDataSerializedV4,
  UserFacingERC721AssetDataSerializedV4,
} from 'evm-nft-swap'
import { PostOrderResponsePayload } from 'evm-nft-swap/dist/sdk/v4/orderbook'
import useAuth from 'hooks/auth/useAuth'
import useReactQuery from 'hooks/complex/useReactQuery'
import useFsChannel from 'hooks/firestore/useFsChannel'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import { serializeNftOrder } from 'libs/zx'
import _ from 'lodash'
import { useMemo, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import postTxStore from 'store/postTxStore'
import {
  ContractAddr,
  FbListing,
  PostTxStatus,
  QueryKeyEnum,
  SupportedNetworkEnum,
  Token,
} from 'types'

import firestore from '@react-native-firebase/firestore'

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
      await fsChannel
        .collection('listings')
        .doc(postedOrder.order.nonce)
        .set(listing)

      // also add to listings collection for keeping track of listed channels for the nft
      await firestore()
        .collection('listings')
        .doc(postedOrder.order.nonce)
        .set(listing)
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
