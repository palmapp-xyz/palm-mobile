import { COLOR, NETWORK } from 'consts'
import useSetting from 'hooks/independent/useSetting'
import React, { ReactElement, useEffect, useState } from 'react'
import DropDownPicker from 'react-native-dropdown-picker'
import { ChainNetworkEnum } from 'types'

const NetworkOptions = (): ReactElement => {
  const { setting, updateSetting } = useSetting()

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<ChainNetworkEnum>(setting.network)

  const options = Object.keys(NETWORK.chainId).map(chain => {
    return { label: chain, value: chain }
  })
  const [items, setItems] = useState(options)

  useEffect(() => {
    if (setting.network !== value) {
      setting.network = value
      updateSetting(setting)
      setValue(setting.network)
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

export default NetworkOptions
