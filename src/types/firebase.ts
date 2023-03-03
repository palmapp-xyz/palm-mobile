import { ChannelType } from '@sendbird/chat'
import { ContractAddr } from './contracts'
import { zx } from './zx'

export type FbListingState = 'active' | 'completed' | 'cancelled'

export type FbListing = {
  order: zx.order['order']
  status: FbListingState
  channelUrl?: string
}

export type FbChannelField = {
  url: string
  channelType: ChannelType
  gatingToken?: ContractAddr
}

export enum FirestoreKeyEnum {
  Channel = 'Channel',
  ChannelField = 'ChannelField',
}
