import React, { ReactElement } from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'

export type FormButtonProps = {
  children: string
  disabled?: boolean
  onPress?: () => void
  figure?: 'primary' | 'error'
  size?: 'sm' | 'md'
}

const FormButton = ({
  children,
  disabled,
  onPress,
  figure = 'primary',
  size = 'md',
}: FormButtonProps): ReactElement => {
  const mainColor = figure === 'primary' ? '#2960FF' : '#F84F4F'

  const paddingVertical = size === 'md' ? 15 : 10
  const fontSize = size === 'md' ? 16 : 14

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: disabled ? 'gray' : mainColor, paddingVertical },
      ]}
      disabled={disabled}
      onPress={onPress}>
      <Text style={[styles.text, { fontSize }]}>{children}</Text>
    </TouchableOpacity>
  )
}

export default FormButton

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  text: {
    fontWeight: 'bold',
    color: 'white',
  },
})
