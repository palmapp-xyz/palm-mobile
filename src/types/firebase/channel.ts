import { ChannelType } from '@sendbird/chat'

import { ContractAddr, NftType } from '../contracts'
import { SupportedNetworkEnum } from '../network'

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

export type FbChannel = {
  url: string
  coverImage?: string
  channelType: ChannelType
  tags: string[]
  name: string
  desc: string
  gating?: FbChannelGatingField
}
