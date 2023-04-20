import React, { ReactElement } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

import { COLOR } from 'consts'
import { FormText } from 'components'

const MenuItem = ({
  id,
  title,
  selected,
  setSelected,
}: {
  id: string
  title: string
  selected: boolean
  setSelected: (value: string) => void
}): ReactElement => {
  return (
    <TouchableOpacity
      style={[
        styles.item,
        { backgroundColor: selected ? COLOR.main_light : 'white' },
      ]}
      onPress={(): void => setSelected(id)}>
      <FormText
        fontType="SB.14"
        color={selected ? COLOR.primary._400 : COLOR.black._400}>
        #{title}
      </FormText>
    </TouchableOpacity>
  )
}

export default MenuItem

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLOR.black._50,
  },
})
