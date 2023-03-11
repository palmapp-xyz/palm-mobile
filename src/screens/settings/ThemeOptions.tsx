import { COLOR } from 'consts'
import useSetting from 'hooks/independent/useSetting'
import React, { ReactElement, useEffect, useState } from 'react'
import DropDownPicker from 'react-native-dropdown-picker'
import { ThemeModeType } from 'types'

const ThemeOptions = (): ReactElement => {
  const { setting, updateSetting } = useSetting()

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<ThemeModeType>(setting.themeMode)

  const [items, setItems] = useState([
    { label: 'light', value: 'light' },
    { label: 'dark', value: 'dark' },
  ])

  useEffect(() => {
    if (setting.themeMode !== value) {
      setting.themeMode = value
      updateSetting(setting)
      setValue(setting.themeMode)
    }
  }, [value])

  return (
    <DropDownPicker
      textStyle={{ color: COLOR.primary._400 }}
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      listMode="MODAL"
    />
  )
}

export default ThemeOptions
