import { ChannelType } from '@sendbird/chat'
import { ContractAddr, NftType } from './contracts'
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

export type FbChannelNativeGatingField = {
  gatingType: 'Native'
  amount: string
  chain: SupportedNetworkEnum
}

export type FbChannelFTGatingField = {
  gatingType: 'FT'
  tokenAddress: ContractAddr
  amount: string
  chain: SupportedNetworkEnum
}

export type FbChannelNFTGatingField = {
  gatingType: 'NFT'
  tokenAddress: ContractAddr
  tokenType: NftType
  amount: string
  chain: SupportedNetworkEnum
}

export type FbChannelGatingField =
  | FbChannelNativeGatingField
  | FbChannelFTGatingField
  | FbChannelNFTGatingField

export type FbChannelField = {
  url: string
  channelType: ChannelType
  tags: string[]
  desc: string
  gating?: FbChannelGatingField
}

export type FbTags = {
  [id: string]: string
}

export enum FirestoreKeyEnum {
  Tag = 'Tag',
  Channel = 'Channel',
  ChannelField = 'ChannelField',
  Listing = 'Listing',
  ListingField = 'ListingField',
  Profile = 'Profile',
  ProfileField = 'ProfileField',
}
