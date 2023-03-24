import { ChannelType } from '@sendbird/chat'
import { ContractAddr } from './contracts'
import { zx } from './zx'
import { SupportedNetworkEnum } from './network'

export type FbListingState = 'active' | 'completed' | 'cancelled'

export type FbListing = {
  order: zx.order['order']
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
