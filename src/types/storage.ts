import { AuthenticationResult } from 'graphqls/__generated__/graphql'
import { ContractAddr } from './contracts'
import { NetworkSettingEnum } from './network'
import { ThemeModeType } from './theme'
import { AuthChallengeResult } from './auth'

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
  network: NetworkSettingEnum
}
