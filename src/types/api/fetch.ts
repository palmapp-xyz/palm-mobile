import { NominalType } from '../common'
import { ContractAddr } from '../contracts'
import { Accounts } from './accounts'
import { Moralis } from './moralis'

export enum ApiEnum {
  MORALIS_AUTH_REQUEST_MESSAGE = 'MORALIS_AUTH_REQUEST_MESSAGE',
  MORALIS_AUTH_ISSUE_TOKEN = 'MORALIS_AUTH_ISSUE_TOKEN',

  AUTH = 'AUTH',
  ACCOUNTS = 'ACCOUNTS',
  ASSETS = 'ASSETS',
  COLLECTIONS = 'COLLECTIONS',

  FRIENDS = 'FRIENDS',
  CHANNELS = 'CHANNELS',
  CHANNEL = 'CHANNEL',
}

export type ApiParamFabricated = string & NominalType<'ApiParamFabricated'>

type DefaultMethods = {
  GET: undefined
  POST: undefined
  PUT: undefined
  DEL: undefined
}

type Override<T> = Omit<DefaultMethods, keyof T> & T

export type ApiParams = {
  [ApiEnum.MORALIS_AUTH_REQUEST_MESSAGE]: Override<{
    POST: {
      data: {
        networkType: 'evm'
        address: string
        chain: string
      }
    }
  }>
  [ApiEnum.MORALIS_AUTH_ISSUE_TOKEN]: Override<{
    POST: {
      networkType: 'evm'
      message: string
      signature: string
    }
  }>

  [ApiEnum.ASSETS]: DefaultMethods
  [ApiEnum.COLLECTIONS]: DefaultMethods
  [ApiEnum.FRIENDS]: DefaultMethods

  [ApiEnum.CHANNELS]: DefaultMethods
  [ApiEnum.CHANNEL]: DefaultMethods

  [ApiEnum.AUTH]: Override<{
    POST: {
      address: ContractAddr
      message: string
      signature: string
      wallet: 'kaikas' | 'metamask'
    }
  }>
  [ApiEnum.ACCOUNTS]: Override<{
    PUT: {
      id: number
      address: ContractAddr
      council_id: number
      level: 0 | 1
      type: 0 | 1
    }
    POST: {
      address: ContractAddr
      council_id: number
      level: 0 | 1
      type: 0 | 1
    }
    DEL: {
      address: ContractAddr
      council_id: number
      id: number
    }
  }>
}

export type ApiFetchResult<T = ApiResponse[ApiEnum][keyof DefaultMethods]> =
  | {
      success: true
      data: T
    }
  | {
      success: false
      errMsg: string
    }

export type ApiResponse = {
  [ApiEnum.MORALIS_AUTH_REQUEST_MESSAGE]: Override<{
    POST: {
      result: {
        id: string
        message: string
        profileId: string
      }
    }
  }>
  [ApiEnum.MORALIS_AUTH_ISSUE_TOKEN]: Override<{
    POST: {
      result: {
        idToken: string
      }
    }
  }>

  [ApiEnum.AUTH]: Override<{ POST: string }>
  [ApiEnum.ACCOUNTS]: Override<{ GET: Accounts.Item }>
  [ApiEnum.ASSETS]: Override<{
    GET: {
      page: number
      page_size: number
      cursor: string
      result: Moralis.NftItem[]
    }
  }>
  [ApiEnum.COLLECTIONS]: Override<{
    GET: {
      page: number
      page_size: number
      cursor: string
      result: Moralis.NftCollection[]
    }
  }>

  [ApiEnum.FRIENDS]: DefaultMethods

  [ApiEnum.CHANNELS]: DefaultMethods
  [ApiEnum.CHANNEL]: DefaultMethods
}
