import { COLOR } from 'consts'
import useSetting from 'hooks/independent/useSetting'
import React, { ReactElement, useEffect, useState } from 'react'
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker'

const NetworkOptions = (): ReactElement => {
  const { setting, updateSetting } = useSetting()

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(setting.network)

  const options: ItemType<'mainnet' | 'testnet'>[] = [
    { label: 'Mainnet', value: 'mainnet' },
    { label: 'Testnet', value: 'testnet' },
  ]
  const [items, setItems] = useState<ItemType<'mainnet' | 'testnet'>[]>(options)

  const onChangeValue = (selected: 'mainnet' | 'testnet' | null): void => {
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
