import { COLOR } from 'palm-core/consts'
import { FONT } from 'palm-react-ui-kit/consts'
import { FontSize, FontType } from 'palm-react-ui-kit/types'
import React, { ReactElement } from 'react'
import { StyleSheet, TextInput, TextInputProps } from 'react-native'

const FormInput = (
  props: {
    inputRef?: React.LegacyRef<TextInput>
    fontType?: FontType
    font?: 'R' | 'B' | 'SB'
    size?: FontSize
    disabled?: boolean
  } & TextInputProps
): ReactElement => {
  const { style, font = 'R', size = 14, ...rest } = props
  const fontStyle = FONT.getFontStyle(`${font}.${size}` as FontType)
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
    paddingVertical: 10,
    paddingHorizontal: 14,
    height: 40,
  },
})
