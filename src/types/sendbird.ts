import { Moralis } from './api'
import { ContractAddr } from './contracts'
import { pToken } from './currencies'
import { zx } from './zx'

export type SbNftDataType =
  | SbBuyNftDataType
  | SbListNftDataType
  | SbSendNftDataType
  | SbShareNftDataType

export type SbBuyNftDataType = {
  type: 'buy'
  selectedNft: zx.order
  buyer: ContractAddr
}

export type SbListNftDataType = {
  type: 'list'
  selectedNft: Moralis.NftItem
  nonce: string
  ethAmount: pToken
}

export type SbSendNftDataType = {
  type: 'send'
  selectedNft: Moralis.NftItem
  from: ContractAddr
  to: ContractAddr
}

export type SbShareNftDataType = {
  type: 'share'
  selectedNft: Moralis.NftItem
}
