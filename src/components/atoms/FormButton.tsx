import React, { ReactElement } from 'react'
import { StyleSheet, Pressable, Text } from 'react-native'

type FormButtonProps = {
  children: string
  disabled?: boolean
  onPress: () => void
  figure?: 'primary' | 'error'
}

const FormButton = ({
  children,
  disabled,
  onPress,
  figure = 'primary',
}: FormButtonProps): ReactElement => {
  const mainColor = figure === 'primary' ? '#2960FF' : '#F84F4F'

  return (
    <Pressable
      style={[
        styles.container,
        { backgroundColor: disabled ? 'gray' : mainColor },
      ]}
      disabled={disabled}
      onPress={onPress}>
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  )
}

export default FormButton

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
})
