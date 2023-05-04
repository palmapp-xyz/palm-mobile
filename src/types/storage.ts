import { AuthenticationResult } from 'graphqls/__generated__/graphql'

import { AuthChallengeResult } from './auth'
import { ContractAddr } from './contracts'
import { ThemeModeType } from './theme'

export enum KeyChainEnum {
  MNEMONIC = 'MNEMONIC',
  PK = 'PK',
  PK_PWD = 'PK_PWD',
}

export enum LocalStorageKey {
  SETTING = 'SETTING',
  AUTH = 'AUTH',
  RECENTLY_SEARCHED = 'RECENTLY_SEARCHED',
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
