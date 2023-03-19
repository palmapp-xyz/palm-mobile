import { NetworkSettingEnum } from './network'
import { ThemeModeType } from './theme'

export enum KeyChainEnum {
  PK = 'PK',
  PK_PWD = 'PK_PWD',
}

export enum LocalStorageKey {
  SETTING = 'SETTING',
}

export type SettingStorageType = {
  themeMode: ThemeModeType
  network: NetworkSettingEnum
}
