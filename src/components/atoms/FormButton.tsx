import { COLOR } from 'core/consts'
import React, { ReactElement } from 'react'
import {
  ColorValue,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import FormText from './FormText'

export type FormButtonProps = {
  children: string
  disabled?: boolean
  onPress?: () => void
  figure?: 'primary' | 'outline' | 'error'
  size?: 'sm' | 'md' | 'lg'
  containerStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  rightIcon?: string
  rightIconSize?: number
  rightIconColor?: ColorValue
}

const FormButton = ({
  children,
  disabled,
  onPress,
  figure = 'primary',
  size = 'md',
  containerStyle,
  textStyle,
  rightIcon,
  rightIconSize,
  rightIconColor,
}: FormButtonProps): ReactElement => {
  let mainColor = COLOR.primary._400
  if (figure === 'error') {
    mainColor = '#F84F4F'
  }

  const paddingVertical = size === 'md' ? 8 : 'lg' ? 11 : 5
  const fontColor = figure === 'outline' ? mainColor : 'white'
  const backgroundColor = disabled
    ? COLOR.black._200
    : figure === 'outline'
    ? 'white'
    : mainColor
  const borderColor = disabled ? COLOR.black._200 : mainColor

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor,
          paddingVertical,
          borderColor,
        },
        containerStyle,
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      <FormText
        size={size === 'sm' ? 14 : 16}
        style={[{ color: fontColor }, textStyle]}
      >
        {children}
      </FormText>
      {rightIcon && (
        <Ionicons
          name={rightIcon}
          size={rightIconSize || 14}
          color={rightIconColor || COLOR.black._300}
        />
      )}
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
    borderWidth: 1,
  },
})
