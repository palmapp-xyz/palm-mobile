import { COLOR } from 'consts'
import React, { ReactElement } from 'react'
import Container from './Container'
import { View, ActivityIndicator, StyleSheet } from 'react-native'

const LoadingPage = (): ReactElement => {
  return (
    <Container style={styles.container}>
      <View style={styles.body}>
        <ActivityIndicator size="large" color={COLOR.primary._300} />
      </View>
    </Container>
  )
}

export default LoadingPage

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: {
    flex: 1,
    gap: 20,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
