import React, { ReactElement } from 'react'
import { StyleSheet, TextInput, TextInputProps } from 'react-native'

import { COLOR } from 'consts'

const FormInput = (props: TextInputProps): ReactElement => {
  const { style, ...rest } = props

  return <TextInput style={[styles.container, style]} {...rest} />
}

export default FormInput

const styles = StyleSheet.create({
  container: {
    borderColor: `${COLOR.gray._900}${COLOR.opacity._10}`,
    borderRadius: 14,
    borderStyle: 'solid',
    borderWidth: 1.5,
    paddingHorizontal: 14,
    height: 36,
    backgroundColor: 'white',
    fontSize: 14,
  },
})
