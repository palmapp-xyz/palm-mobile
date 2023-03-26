import { ChannelType } from '@sendbird/chat'
import { ContractAddr } from './contracts'
import { SupportedNetworkEnum } from './network'
import { PostOrderResponsePayload } from 'evm-nft-swap/dist/sdk/v4/orderbook'

export type FbListingState = 'active' | 'completed' | 'cancelled'

export type FbListing = {
  nftContract: ContractAddr
  tokenId: string
  order: PostOrderResponsePayload
  status: FbListingState
  channelUrl?: string
}

export type FbChannelField = {
  url: string
  channelType: ChannelType
  gatingToken?: ContractAddr
  gatingTokenChain?: SupportedNetworkEnum
}

export enum FirestoreKeyEnum {
  Channel = 'Channel',
  ChannelField = 'ChannelField',
  Listing = 'Listing',
  ListingField = 'ListingField',
}
