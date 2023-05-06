import { COLOR, STYLE } from 'consts'
import React, { ReactElement } from 'react'
import { StyleSheet, TextInput, TextInputProps } from 'react-native'
import { FontType } from 'types'

const FormInput = (
  props: {
    inputRef?: React.LegacyRef<TextInput>
    fontType?: FontType
  } & TextInputProps
): ReactElement => {
  const { style, fontType = 'R.16', ...rest } = props
  const fontStyle = STYLE.getFontStyle(fontType)

  return (
    <TextInput
      ref={props.inputRef}
      style={[styles.container, style, fontStyle]}
      {...rest}
    />
  )
}

export default FormInput

const styles = StyleSheet.create({
  container: {
    borderColor: COLOR.black._90010,
    borderRadius: 14,
    borderStyle: 'solid',
    borderWidth: 1.5,
    paddingHorizontal: 14,
    height: 36,
    backgroundColor: 'white',
    fontSize: 14,
  },
})
