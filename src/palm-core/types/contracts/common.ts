import { SupportedNetworkEnum } from 'palm-core/types'

import { NominalType } from '../common'

export type ContractAddr = string & NominalType<'ContractAddr'>
export type EncodedTxData = string & NominalType<'EncodedTxData'>

export type NetworkContractMap = {
  escrow: ContractAddr
  lens_hub?: ContractAddr
  lens_follow_nft?: ContractAddr
  lens_periphery?: ContractAddr
}

export type ContractMap = Record<SupportedNetworkEnum, NetworkContractMap>

export enum NftType {
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
}
