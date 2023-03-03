import { ChannelType } from '@sendbird/chat'
import { zx } from './zx'

export type FbListingState = 'active' | 'completed' | 'cancelled'

export type FbListing = {
  order: zx.order['order']
  status: FbListingState
  channelUrl?: string
}

export type FbChannel = {
  url: string
  channelType: ChannelType
  listings: FbListing
}
