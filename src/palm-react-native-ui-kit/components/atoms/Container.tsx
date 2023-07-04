import React, { ReactElement, ReactNode } from 'react'
import {
  ColorValue,
  ScrollView,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import KeyboardAvoidingView from './KeyboardAvoidingView'

const Container = ({
  children,
  style,
  safeAreaBackgroundColor,
  keyboardAvoiding,
  scrollable,
}: {
  children: ReactNode
  style?: StyleProp<ViewStyle>
  safeAreaBackgroundColor?: ColorValue
  keyboardAvoiding?: boolean
  scrollable?: boolean
}): ReactElement => {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: safeAreaBackgroundColor || 'white' }}
    >
      {keyboardAvoiding ? (
        <KeyboardAvoidingView>
          <View style={style}>{children}</View>
        </KeyboardAvoidingView>
      ) : scrollable ? (
        <ScrollView
          bounces={false}
          contentContainerStyle={{ flex: 1 }}
          contentInsetAdjustmentBehavior="always"
          overScrollMode="always"
          showsVerticalScrollIndicator={true}
        >
          <View style={style}>{children}</View>
        </ScrollView>
      ) : (
        <View style={style}>{children}</View>
      )}
    </SafeAreaView>
  )
}

export default Container
