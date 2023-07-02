import useSetting from 'hooks/independent/useSetting'
import { COLOR } from 'palm-core/consts'
import { ThemeModeType } from 'palm-core/types'
import React, { ReactElement, useEffect, useState } from 'react'
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker'

const ThemeOptions = (): ReactElement => {
  const { setting, updateSetting } = useSetting()

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<ThemeModeType>(setting.themeMode)

  const [items, setItems] = useState<ItemType<ThemeModeType>[]>([
    { label: 'light', value: 'light' },
    { label: 'dark', value: 'dark' },
  ])

  const onChangeValue = (selected: ThemeModeType | null): void => {
    if (!selected || setting.themeMode === selected) {
      return
    }
    setting.themeMode = selected
    updateSetting(setting)
  }

  useEffect(() => {
    if (setting.themeMode !== value) {
      setValue(setting.themeMode)
    }
  }, [setting])

  return (
    <DropDownPicker
      textStyle={{ color: COLOR.primary._400 }}
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      onChangeValue={onChangeValue}
      listMode="MODAL"
    />
  )
}

export default ThemeOptions
