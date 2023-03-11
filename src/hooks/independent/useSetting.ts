import AsyncStorage from '@react-native-async-storage/async-storage'
import { useQuery } from 'react-query'
import RNRestart from 'react-native-restart'

import { UTIL } from 'consts'

import { ChainNetworkEnum, LocalStorageKey, SettingStorageType } from 'types'
import { useEffect, useState } from 'react'

export type UseSettingReturn = {
  setting: SettingStorageType
  updateSetting: (setting: SettingStorageType) => Promise<void>
}

const defaultSetting: SettingStorageType = {
  themeMode: 'light',
  network: ChainNetworkEnum.GOERLI,
}

const useSetting = (): UseSettingReturn => {
  const [setting, setSetting] = useState<SettingStorageType>(defaultSetting)

  const { isLoading, isError, data } = useQuery(
    [LocalStorageKey.SETTING],
    async () => {
      const item = await AsyncStorage.getItem(LocalStorageKey.SETTING)
      const r = UTIL.jsonTryParse<SettingStorageType>(item || '')
      if (!r) {
        return r
      }
      if (r.themeMode !== 'dark' && r.themeMode !== 'light') {
        r.themeMode = defaultSetting.themeMode
      }
      if (
        r.network !== ChainNetworkEnum.ETHEREUM &&
        r.network !== ChainNetworkEnum.GOERLI
      ) {
        r.network = defaultSetting.network
      }
      return r
    }
  )

  useEffect(() => {
    if (!isLoading && !isError && data) {
      setSetting(data)
    }
  }, [data])

  const updateSetting = async (updated: SettingStorageType): Promise<void> => {
    await AsyncStorage.setItem(LocalStorageKey.SETTING, JSON.stringify(updated))
    console.log('updated', updated)
    setSetting(updated)
    RNRestart.restart()
  }

  return { setting, updateSetting }
}

export default useSetting
