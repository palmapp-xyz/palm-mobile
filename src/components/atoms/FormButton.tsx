import React, { ReactElement } from 'react'
import { StyleSheet, Pressable, Text } from 'react-native'

type FormButtonProps = {
  children: string
  disabled?: boolean
  onPress: () => void
}

const FormButton = ({
  children,
  disabled,
  onPress,
}: FormButtonProps): ReactElement => {
  return (
    <Pressable style={styles.container} disabled={disabled} onPress={onPress}>
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  )
}

export default FormButton

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#2960FF',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
})
