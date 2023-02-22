import { useMemo, useState } from 'react'
import {
  UserFacingERC721AssetDataSerializedV4,
  UserFacingERC20AssetDataSerializedV4,
} from '@traderxyz/nft-swap-sdk'

import { UTIL } from 'consts'

import useReactQuery from 'hooks/complex/useReactQuery'
import useAuth from 'hooks/independent/useAuth'
import { ContractAddr, QueryKeyEnum, Token } from 'types'
import useZx from './useZx'

export type UseZxSellNftReturn = {
  isApproved: boolean
  onClickApprove: () => Promise<void>
  onClickConfirm: () => Promise<void>
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
  const { nftSwapSdk } = useZx()
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
    [nftContract, price]
  )

  const { data: isApproved = false } = useReactQuery(
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
      const approvalTx = await nftSwapSdk.approveTokenOrNftByAsset(
        nftToSwap,
        user.address
      )
      const approvalTxReceipt = await approvalTx.wait()
      console.log('approvalTxReceipt : ', approvalTxReceipt)
    }
  }

  const onClickConfirm = async (): Promise<void> => {
    if (user && nftSwapSdk) {
      const order = nftSwapSdk.buildOrder(nftToSwap, priceOfNft, user.address)
      // Sign the order (User A signs since they are initiating the trade)
      const signedOrder = await nftSwapSdk.signOrder(order)
      console.log('signedOrder : ', signedOrder)
      const postOrder = await nftSwapSdk.postOrder(
        signedOrder,
        nftSwapSdk.chainId
      )
      console.log('postOrder : ', postOrder)
    }
  }
  return { onClickApprove, onClickConfirm, isApproved, price, setPrice }
}

export default useZxSellNft
