import { useMemo, useState } from 'react'
import {
  UserFacingERC721AssetDataSerializedV4,
  UserFacingERC20AssetDataSerializedV4,
  SignedNftOrderV4Serialized,
} from '@traderxyz/nft-swap-sdk'

import { UTIL } from 'consts'

import useReactQuery from 'hooks/complex/useReactQuery'
import useAuth from 'hooks/independent/useAuth'
import { ContractAddr, PostTxStatus, QueryKeyEnum, Token } from 'types'
import useZx from './useZx'
import { useSetRecoilState } from 'recoil'
import postTxStore from 'store/postTxStore'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'

export type UseZxSellNftReturn = {
  isApproved: boolean
  onClickApprove: () => Promise<void>
  onClickConfirm: () => Promise<SignedNftOrderV4Serialized | undefined>
  price: Token
  setPrice: (value: Token) => void
}

const useZxSellNft = ({
  nftContract,
  tokenId,
}: {
  nftContract: ContractAddr
  tokenId: string
}): UseZxSellNftReturn => {
  const { navigation } = useAppNavigation()
  const { nftSwapSdk } = useZx()
  const setPostTxResult = useSetRecoilState(postTxStore.postTxResult)

  const { user } = useAuth()
  const [price, setPrice] = useState<Token>('' as Token)

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
    [QueryKeyEnum.NFT_APPROVED, nftContract, user?.address],
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
        })
        const approvalTx = await nftSwapSdk.approveTokenOrNftByAsset(
          nftToSwap,
          user.address
        )
        setPostTxResult({
          status: PostTxStatus.BROADCAST,
          transactionHash: approvalTx.hash,
        })

        const approvalTxReceipt = await approvalTx.wait()
        setPostTxResult({
          status: PostTxStatus.DONE,
          value: approvalTxReceipt,
        })
      } catch (error) {
        setPostTxResult({
          status: PostTxStatus.ERROR,
          error,
        })
      }
      refetchIsApprove()
    }
  }

  const onClickConfirm = async (): Promise<
    SignedNftOrderV4Serialized | undefined
  > => {
    if (user && nftSwapSdk) {
      try {
        setPostTxResult({
          status: PostTxStatus.POST,
        })
        const order = nftSwapSdk.buildOrder(nftToSwap, priceOfNft, user.address)

        // Sign the order (User A signs since they are initiating the trade)
        const signedOrder = await nftSwapSdk.signOrder(order)

        const postOrder = await nftSwapSdk.postOrder(
          signedOrder,
          nftSwapSdk.chainId
        )

        setPostTxResult({ status: PostTxStatus.DONE })
        navigation.replace(Routes.ZxNftDetail, {
          nonce: postOrder.order.nonce,
        })

        return postOrder.order
      } catch (error) {
        setPostTxResult({
          status: PostTxStatus.ERROR,
          error,
        })
      }
    }
    return undefined
  }
  return { onClickApprove, onClickConfirm, isApproved, price, setPrice }
}

export default useZxSellNft
