import LensLogo from 'assets/LensLogo'
import { Container } from 'components'
import useAuth from 'hooks/auth/useAuth'
import { recordError } from 'libs/logger'
import React, { ReactElement, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { useAlert } from '@sendbird/uikit-react-native-foundation'

const SignInWithLens = (): ReactElement => {
  const { lensLogin, logout } = useAuth()
  const { alert } = useAlert()

  useEffect(() => {
    lensLogin().then(res => {
      if (!res.success) {
        recordError(new Error(res.errMsg), 'SignInWithLens:lensLogin')
        alert({ title: 'Failure', message: res.errMsg })
        logout()
      } else {
        if (res.value) {
          console.log('SignInWithLens:lensLogin', res.value)
        } else {
          console.log('SignInWithLens:lensLogin not a lens user')
        }
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
        }}
      >
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
