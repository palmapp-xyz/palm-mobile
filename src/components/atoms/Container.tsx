import React, { ReactElement, ReactNode } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Container = ({
  children,
  style,
}: {
  children: ReactNode
  style?: StyleProp<ViewStyle>
}): ReactElement => {
  return (
    <SafeAreaView>
      <View style={[styles.container, style]}>{children}</View>
    </SafeAreaView>
  )
}

export default Container

const styles = StyleSheet.create({
  container: { padding: 20 },
})
