import { PostOrderResponsePayload } from 'evm-nft-swap/dist/sdk/v4/orderbook'

import { User } from '@sendbird/chat'
import { Member } from '@sendbird/chat/groupChannel'
import { Moralis } from './api'
import { ContractAddr } from './contracts'
import { pToken } from './currencies'

export type SbMsgDataType =
  | SbBuyNftDataType
  | SbListNftDataType
  | SbSendNftDataType
  | SbSendTokenDataType
  | SbShareNftDataType

export type SbBuyNftDataType = {
  type: 'buy'
  selectedNft: PostOrderResponsePayload
  buyer: SbUserMetadata
  from: SbUserMetadata
  price: { tokenName: string; amount: string }
}

export type SbListNftDataType = {
  type: 'list'
  selectedNft: Moralis.NftItem
  nonce: string
  amount: pToken
  owner: SbUserMetadata
}

export type SbSendNftDataType = {
  type: 'send-nft'
  selectedNft: Moralis.NftItem
  txHash: string
  from: SbUserMetadata
  to: SbUserMetadata
}

export type SbSendTokenDataType = {
  type: 'send-token'
  selectedToken: Moralis.FtItem
  value: pToken
  txHash: string
  from: SbUserMetadata
  to: SbUserMetadata
}

export type SbShareNftDataType = {
  type: 'share'
  selectedNft: Moralis.NftItem
  owner: SbUserMetadata
}

export type SbUserMetadata = {
  profileId: string
  handle?: string
  address: ContractAddr
}

export type SbUserWithSelected = User & { selected?: boolean }
export type SbMemberWithSelected = Member & { selected?: boolean }
