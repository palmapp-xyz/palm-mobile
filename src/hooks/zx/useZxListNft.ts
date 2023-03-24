import { useMemo, useState } from 'react'
import {
  UserFacingERC721AssetDataSerializedV4,
  UserFacingERC20AssetDataSerializedV4,
  SignedNftOrderV4Serialized,
} from 'evm-nft-swap'

import { UTIL } from 'consts'

import useReactQuery from 'hooks/complex/useReactQuery'
import useAuth from 'hooks/independent/useAuth'
import {
  ContractAddr,
  PostTxStatus,
  QueryKeyEnum,
  SupportedNetworkEnum,
  Token,
} from 'types'
import useZx from './useZx'
import { useSetRecoilState } from 'recoil'
import postTxStore from 'store/postTxStore'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'

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
}: {
  nftContract: ContractAddr
  tokenId: string
  chain: SupportedNetworkEnum
}): UseZxListNftReturn => {
  const { navigation } = useAppNavigation()
  const { nftSwapSdk } = useZx(chain)
  const setPostTxResult = useSetRecoilState(postTxStore.postTxResult)

  const { user } = useAuth(chain)
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
        const signedOrder = await nftSwapSdk.signOrder(order)

        const postOrder = await nftSwapSdk.postOrder(
          signedOrder,
          nftSwapSdk.chainId
        )

        setPostTxResult({
          status: PostTxStatus.DONE,
          chain,
        })
        navigation.replace(Routes.ZxNftDetail, {
          nonce: postOrder.order.nonce,
          chain,
        })

        return postOrder.order
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
