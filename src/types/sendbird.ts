import { Moralis } from './api'
import { ContractAddr } from './contracts'

export type SbNftDataType =
  | SbSellNftDataType
  | SbSendNftDataType
  | SbShareNftDataType

export type SbSellNftDataType = {
  type: 'sell'
  selectedNft: Moralis.NftItem
  nonce: string
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
