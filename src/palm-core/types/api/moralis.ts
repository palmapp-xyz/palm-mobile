import { ContractAddr, NftType } from '../contracts'
import { ItemsFetchResult } from './'

export namespace Moralis {
  export type TokenPrice = {
    tokenName: string
    tokenSymbol: string
    tokenLogo: string
    tokenDecimals: string
    nativePrice: {
      value: string
      decimals: number
      name: string
      symbol: string
    }
    usdPrice: number
    usdPriceFormatted?: string
    '24hrPercentChange'?: string
    exchangeAddress: ContractAddr
    exchangeName: string
    tokenAddress: ContractAddr
  }

  export type FtItem = {
    token_address: ContractAddr
    name: string
    symbol: string
    logo: string | null
    thumbnail: string | null
    decimals: number
    balance: string
    possible_spam?: boolean
    chainId?: number
    price?: TokenPrice | null
  }

  export type NftItem = {
    token_address: ContractAddr
    token_id: string
    amount: string
    owner_of: ContractAddr
    token_hash: string
    block_number_minted: string
    block_number: string
    contract_type: NftType
    name: string
    symbol: string
    token_uri: string
    metadata?: string
    last_token_uri_sync: string
    last_metadata_sync: string
    minter_address: ContractAddr
    chainId?: number
    media?: {
      mimetype: string
      parent_hash: string
      status: MediaPreviewStatus
      updatedAt: string
      media_collection?: {
        low: MediaPreview
        medium: MediaPreview
        high: MediaPreview
      }
      original_media_url: string
    }
    possible_spam?: boolean
  }

  export enum Status {
    SYNCED = 'SYNCED',
    SYNCING = 'SYNCING',
  }

  // https://docs.moralis.io/web3-data-api/evm/nft-image-previews#what-formats-are-supported
  export type MediaPreview = {
    height: number
    width: number
    url: string
  }

  // https://docs.moralis.io/web3-data-api/evm/nft-image-previews#im-using-the-query-parameter-but-im-not-receiving-any-previews-why
  export enum MediaPreviewStatus {
    success = 'success',
    processing = 'processing',
    unsupported_media = 'unsupported_media',
    invalid_url = 'invalid_url',
    host_unavailable = 'host_unavailable',
    temporarily_unavailable = 'temporarily_unavailable',
  }

  export type NftCollection = {
    token_address: ContractAddr
    contract_type: NftType
    name: string
    symbol: string | null
    chainId?: number
    possible_spam?: boolean | null
    preload?: NftItemsFetchResult | null
  }

  export type NftItemsFetchResult = ItemsFetchResult<Moralis.NftItem> & {
    total: number | null
    page: number
    page_size: number
    cursor: string | null
    status: 'SYNCED'
  }

  export type NftCollectionItemsFetchResult =
    ItemsFetchResult<NftCollection> & {
      total: number | null
      page: number
      page_size: number
      cursor: string | null
      status: 'SYNCED'
    }

  export type FtItemsFetchResult = ItemsFetchResult<FtItem>
}
