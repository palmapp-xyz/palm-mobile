import { COLOR, NETWORK } from 'consts'
import useSetting from 'hooks/independent/useSetting'
import React, { ReactElement, useEffect, useState } from 'react'
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker'
import { ChainNetworkEnum } from 'types'

const NetworkOptions = (): ReactElement => {
  const { setting, updateSetting } = useSetting()

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<ChainNetworkEnum>(setting.network)

  const options = Object.keys(NETWORK.chainId).map(chain => {
    return { label: chain, value: chain } as ItemType<ChainNetworkEnum>
  })
  const [items, setItems] = useState<ItemType<ChainNetworkEnum>[]>(options)

  const onChangeValue = (selected: ChainNetworkEnum | null): void => {
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
