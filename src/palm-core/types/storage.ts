import { AuthenticationResult } from 'palm-core/graphqls'

import { AuthChallengeResult } from './auth'
import { ContractAddr } from './contracts'
import { ThemeModeType } from './theme'

export enum KeyChainEnum {
  MNEMONIC = 'MNEMONIC',
  PK = 'PK',
  PK_PWD = 'PK_PWD',
  PIN = 'PIN',
  NEW_PIN = 'NEW_PIN',
}

export enum LocalStorageKey {
  INTEREST = 'INTEREST',
  SETTING = 'SETTING',
  AUTH = 'AUTH',
  RECENTLY_SEARCHED = 'RECENTLY_SEARCHED',
  PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
  PIN_TRY_COUNT = 'PIN_TRY_COUNT',
}

export type AuthStorageType = {
  address: ContractAddr
  lensAuth?: AuthenticationResult | null
  auth?: AuthChallengeResult
}

export type SettingStorageType = {
  themeMode: ThemeModeType
}

export type RecentlySearchItemStorageType = {
  id: string
  search: string
  date: string
}

export type PinStorageType = {
  pin: string
}
