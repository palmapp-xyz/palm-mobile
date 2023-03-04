import { COLOR } from 'consts'
import React, { ReactElement } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  StyleProp,
  ViewStyle,
} from 'react-native'

export type FormButtonProps = {
  children: string
  disabled?: boolean
  onPress?: () => void
  figure?: 'primary' | 'error'
  size?: 'sm' | 'md'
  containerStyle?: StyleProp<ViewStyle>
}

const FormButton = ({
  children,
  disabled,
  onPress,
  figure = 'primary',
  size = 'md',
  containerStyle,
}: FormButtonProps): ReactElement => {
  const mainColor = figure === 'primary' ? COLOR.primary._400 : '#F84F4F'

  const paddingVertical = size === 'md' ? 15 : 10
  const fontSize = size === 'md' ? 16 : 14

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: disabled ? COLOR.gray._200 : mainColor,
          paddingVertical,
        },
        containerStyle,
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
    borderRadius: 15,
    paddingHorizontal: 10,
  },
  text: {
    fontWeight: 'bold',
    color: 'white',
  },
})
