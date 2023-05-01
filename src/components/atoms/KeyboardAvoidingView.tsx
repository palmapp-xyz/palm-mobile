import React, { ReactElement, ReactNode } from 'react'
import {
  KeyboardAvoidingView as KAV,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const KEYBOARD_AVOID_VIEW_BEHAVIOR = Platform.select({
  ios: 'padding' as const,
  default: undefined,
})

const KeyboardAvoidingView = ({
  children,
  style,
}: {
  children: ReactNode
  style?: StyleProp<ViewStyle>
}): ReactElement => {
  const { bottom } = useSafeAreaInsets()

  return (
    <KAV
      style={style}
      keyboardVerticalOffset={bottom}
      behavior={KEYBOARD_AVOID_VIEW_BEHAVIOR}
    >
      {children}
    </KAV>
  )
}

export default KeyboardAvoidingView
