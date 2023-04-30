import { PostOrderResponsePayload } from 'evm-nft-swap/dist/sdk/v4/orderbook'

import { ContractAddr } from '../contracts'

export type FbListingState = 'active' | 'completed' | 'cancelled'

export type FbListing = {
  nftContract: ContractAddr
  tokenId: string
  order: PostOrderResponsePayload
  status: FbListingState
  channelUrl?: string
}
