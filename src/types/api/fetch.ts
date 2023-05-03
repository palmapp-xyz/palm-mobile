import {
  AuthChallengeInfo,
  AuthChallengeResult,
  FbChannel,
  FbProfile,
} from 'types'

import { NominalType } from '../common'
import { ContractAddr } from '../contracts'
import { Accounts } from './accounts'
import { Moralis } from './moralis'

export enum ApiEnum {
  AUTH_CHALLENGE_REQUEST = 'AUTH_CHALLENGE_REQUEST',
  AUTH_CHALLENGE_VERIFY = 'AUTH_CHALLENGE_VERIFY',

  ACCOUNTS = 'ACCOUNTS',
  ASSETS = 'ASSETS',
  COLLECTIONS = 'COLLECTIONS',

  FRIENDS = 'FRIENDS',
  CHANNELS = 'CHANNELS',
  CHANNEL = 'CHANNEL',

  IPFS = 'IPFS',

  SEARCH = 'SEARCH',
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
  [ApiEnum.AUTH_CHALLENGE_REQUEST]: Override<{
    POST: {
      address: ContractAddr
      chainId: number
    }
  }>
  [ApiEnum.AUTH_CHALLENGE_VERIFY]: Override<{
    POST: {
      message: string
      signature: string
    }
  }>

  [ApiEnum.ASSETS]: DefaultMethods
  [ApiEnum.COLLECTIONS]: DefaultMethods
  [ApiEnum.FRIENDS]: DefaultMethods

  [ApiEnum.CHANNELS]: DefaultMethods
  [ApiEnum.CHANNEL]: DefaultMethods

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
  [ApiEnum.IPFS]: Override<{
    POST: {
      path: string
      content: string
    }[]
  }>

  [ApiEnum.SEARCH]: Override<{
    POST: {
      query: string // query to search for - eg: 'vic'
      searchFields: string[] // fields to search in - eg: '[handle, name]'
      page: number // offset in terms of pages - eg: 1 (first page, which means offset = pageSize * (page - 1))
      pageSize: number // number of matching results/profiles to return - eg: 10
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
  [ApiEnum.AUTH_CHALLENGE_REQUEST]: Override<{
    POST: AuthChallengeInfo
  }>
  [ApiEnum.AUTH_CHALLENGE_VERIFY]: Override<{
    POST: AuthChallengeResult
  }>

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

  [ApiEnum.IPFS]: Override<{
    POST: { path: string }[]
  }>

  [ApiEnum.SEARCH]: Override<{
    POST: {
      result: {
        _index: string
        _id: string
        _source: FbProfile | FbChannel
      }[]
    }
  }>
}
