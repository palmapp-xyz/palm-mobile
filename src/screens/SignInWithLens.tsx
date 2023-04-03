import React, { ReactElement, useEffect } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import _ from 'lodash'

import { Container } from 'components'
import LensLogo from 'assets/LensLogo'

import useAuth from 'hooks/independent/useAuth'
import useProfile from 'hooks/independent/useProfile'

const SignInWithLens = (): ReactElement => {
  const { user, logout } = useAuth()

  const { authenticate } = useProfile({
    address: user?.address,
  })

  useEffect(() => {
    authenticate().then(res => {
      if (!res.success) {
        console.error('SignInWithLens:authenticate', res.errMsg)
        Alert.alert(res.errMsg)
        logout()
      }
    })
  }, [])

  return (
    <Container style={styles.container}>
      <View
        style={{
          gap: 30,
          height: 300,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <LensLogo />
        <Text style={{ fontSize: 16 }}>{'Signing in ...'}</Text>
      </View>
    </Container>
  )
}

export default SignInWithLens

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
})
