import React, { ReactElement, ReactNode } from 'react'
import { ColorValue, StyleProp, View, ViewStyle } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Container = ({
  children,
  style,
  safeAreaBackgroundColor,
}: {
  children: ReactNode
  style?: StyleProp<ViewStyle>
  safeAreaBackgroundColor?: ColorValue
}): ReactElement => {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: safeAreaBackgroundColor || 'white' }}
    >
      <View style={style}>{children}</View>
    </SafeAreaView>
  )
}

export default Container
