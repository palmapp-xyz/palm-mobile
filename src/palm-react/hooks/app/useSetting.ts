import { UTIL } from 'palm-core/libs'
import { LocalStorageKey, SettingStorageType } from 'palm-core/types'
import { asyncStorageProvider } from 'palm-react-native/app'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'

export type UseSettingReturn = {
  setting: SettingStorageType
  updateSetting: (setting: SettingStorageType) => Promise<void>
}

const defaultSetting: SettingStorageType = {
  themeMode: 'light',
}

const useSetting = (): UseSettingReturn => {
  const [setting, setSetting] = useState<SettingStorageType>(defaultSetting)

  const { isLoading, isError, data } = useQuery(
    [LocalStorageKey.SETTING],
    async () => {
      const item = await asyncStorageProvider.getItem(LocalStorageKey.SETTING)
      const r = UTIL.jsonTryParse<SettingStorageType>(item || '')
      if (!r) {
        return r
      }
      if (r.themeMode !== 'dark' && r.themeMode !== 'light') {
        r.themeMode = defaultSetting.themeMode
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
    await asyncStorageProvider.setItem(
      LocalStorageKey.SETTING,
      JSON.stringify(updated)
    )
    setSetting(updated)
  }

  return { setting, updateSetting }
}

export default useSetting
