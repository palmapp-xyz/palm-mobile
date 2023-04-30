import { AuthenticationResult } from 'graphqls/__generated__/graphql'

import { AuthChallengeResult } from './auth'
import { ContractAddr } from './contracts'
import { ThemeModeType } from './theme'

export enum KeyChainEnum {
  PK = 'PK',
  PK_PWD = 'PK_PWD',
}

export enum LocalStorageKey {
  SETTING = 'SETTING',
  AUTH = 'AUTH',
}

export type AuthStorageType = {
  address: ContractAddr
  lensAuth?: AuthenticationResult | null
  auth?: AuthChallengeResult
}

export type SettingStorageType = {
  themeMode: ThemeModeType
}
