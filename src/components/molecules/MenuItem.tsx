import { FormText } from 'components'
import { COLOR } from 'core/consts'
import React, { ReactElement } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

const MenuItem = <T,>({
  value,
  title,
  selected,
  setSelected,
}: {
  value: T
  title: string
  selected: boolean
  setSelected: (value: T) => void
}): ReactElement => {
  return (
    <TouchableOpacity
      style={[
        styles.item,
        { backgroundColor: selected ? COLOR.main_light : 'white' },
      ]}
      onPress={(): void => setSelected(value)}
    >
      <FormText
        font={'SB'}
        color={selected ? COLOR.primary._400 : COLOR.black._400}
      >
        {title}
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
