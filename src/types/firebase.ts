import { ChannelType } from '@sendbird/chat'
import { ContractAddr } from './contracts'
import { SupportedNetworkEnum } from './network'
import { SignedNftOrderV4Serialized } from 'evm-nft-swap'

export type FbListingState = 'active' | 'completed' | 'cancelled'

export type FbListing = {
  order: SignedNftOrderV4Serialized
  status: FbListingState
  chain: SupportedNetworkEnum
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
}
