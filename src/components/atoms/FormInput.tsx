import React, { ReactElement } from 'react'
import { StyleSheet, TextInput, TextInputProps } from 'react-native'

const FormInput = (props: TextInputProps): ReactElement => {
  const { style, ...rest } = props

  return <TextInput style={[styles.container, style]} {...rest} />
}

export default FormInput

const styles = StyleSheet.create({
  container: {
    borderColor: 'gray',
    borderRadius: 999,
    borderStyle: 'solid',
    borderWidth: 1,
    paddingHorizontal: 10,
    height: 50,
  },
})
