import { COLOR } from 'consts'
import React, { ReactElement } from 'react'
import { StyleSheet, TextInput, TextInputProps } from 'react-native'

const FormInput = (
  props: { inputRef?: React.LegacyRef<TextInput> } & TextInputProps
): ReactElement => {
  const { style, ...rest } = props

  return (
    <TextInput
      ref={props.inputRef}
      style={[styles.container, style]}
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
