import AsyncStorage from '@react-native-async-storage/async-storage'
import { useQuery } from 'react-query'

import { UTIL } from 'consts'

import { ChainNetworkEnum, LocalStorageKey, SettingStorageType } from 'types'

export type UseSettingReturn = {
  setting: SettingStorageType
}

const defaultSetting: SettingStorageType = {
  themeMode: 'dark',
  network: ChainNetworkEnum.ETHEREUM,
}

const useSetting = (): UseSettingReturn => {
  const { data: setting = defaultSetting } = useQuery(
    [LocalStorageKey.SETTING],
    async () => {
      const item = await AsyncStorage.getItem(LocalStorageKey.SETTING)
      return UTIL.jsonTryParse<SettingStorageType>(item || '')
    }
  )

  return { setting }
}

export default useSetting
