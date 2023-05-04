import { ChannelType } from '@sendbird/chat'

import { ContractAddr, NftType } from '../contracts'
import { SupportedNetworkEnum } from '../network'

type GatingDefault = {
  gatingType: 'Native' | 'FT' | 'NFT'
  amount: string
  chain: SupportedNetworkEnum
  name: string
}

export type FbChannelNativeGatingField = GatingDefault & {
  gatingType: 'Native'
}

export type FbChannelFTGatingField = GatingDefault & {
  gatingType: 'FT'
  tokenAddress: ContractAddr
}

export type FbChannelNFTGatingField = GatingDefault & {
  gatingType: 'NFT'
  tokenAddress: ContractAddr
  tokenType: NftType
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
