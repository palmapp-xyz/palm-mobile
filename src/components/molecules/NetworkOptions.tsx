import { COLOR } from 'consts'
import useSetting from 'hooks/independent/useSetting'
import _ from 'lodash'
import React, { ReactElement, useEffect, useState } from 'react'
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker'
import { NetworkSettingEnum } from 'types'

const NetworkOptions = (): ReactElement => {
  const { setting, updateSetting } = useSetting()

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(setting.network)

  const options: ItemType<NetworkSettingEnum>[] = Object.keys(
    NetworkSettingEnum
  ).map((chain: string) => {
    return {
      label: _.capitalize(NetworkSettingEnum[chain]),
      value: NetworkSettingEnum[chain],
    }
  })
  const [items, setItems] = useState<ItemType<NetworkSettingEnum>[]>(options)

  const onChangeValue = (selected: NetworkSettingEnum | null): void => {
    if (!selected || setting.network === selected) {
      return
    }
    setting.network = selected
    updateSetting(setting)
  }

  useEffect(() => {
    if (setting.network !== value) {
      setValue(setting.network)
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

export default NetworkOptions
