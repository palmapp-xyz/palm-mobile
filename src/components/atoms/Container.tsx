import React, { ReactElement, ReactNode } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Container = ({
  children,
  style,
}: {
  children: ReactNode
  style?: StyleProp<ViewStyle>
}): ReactElement => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={style}>{children}</View>
    </SafeAreaView>
  )
}

export default Container
