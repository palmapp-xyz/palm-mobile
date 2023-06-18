import { COLOR, STYLE } from 'consts'
import React, { ReactElement } from 'react'
import { StyleSheet, TextInput, TextInputProps } from 'react-native'
import { FontType } from 'types'

const FormInput = (
  props: {
    inputRef?: React.LegacyRef<TextInput>
    fontType?: FontType
    disabled?: boolean
  } & TextInputProps
): ReactElement => {
  const { style, fontType = 'R.16', ...rest } = props
  const fontStyle = STYLE.getFontStyle(fontType)
  const disabled = props.disabled ?? false

  return (
    <TextInput
      editable={!disabled}
      selectTextOnFocus={!disabled}
      ref={props.inputRef}
      style={[
        { backgroundColor: disabled ? COLOR.black._50 : 'white' },
        styles.container,
        style,
        fontStyle,
      ]}
      placeholderTextColor={COLOR.black._200}
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
  },
})
