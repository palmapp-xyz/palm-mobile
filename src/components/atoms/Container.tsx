import React, { ReactElement, ReactNode } from 'react'
import { ColorValue, StyleProp, View, ViewStyle } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import KeyboardAvoidingView from './KeyboardAvoidingView'

const Container = ({
  children,
  style,
  safeAreaBackgroundColor,
  keyboardAvoiding,
}: {
  children: ReactNode
  style?: StyleProp<ViewStyle>
  safeAreaBackgroundColor?: ColorValue
  keyboardAvoiding?: boolean
}): ReactElement => {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: safeAreaBackgroundColor || 'white' }}
    >
      {keyboardAvoiding ? (
        <KeyboardAvoidingView>
          <View style={style}>{children}</View>
        </KeyboardAvoidingView>
      ) : (
        <View style={style}>{children}</View>
      )}
    </SafeAreaView>
  )
}

export default Container
