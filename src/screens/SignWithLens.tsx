import React, { ReactElement, useEffect } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'

import { Container } from 'components'
import useLens from 'hooks/independent/useLens'
import useAuth from 'hooks/independent/useAuth'
import LensLogo from 'assets/LensLogo'

const SignWithLens = (): ReactElement => {
  const { setAccToken, logout } = useAuth()
  const { sign, signer } = useLens()

  useEffect(() => {
    signer &&
      sign()
        .then(res => {
          if (res.success) {
            setAccToken(res.value)
          } else {
            console.error('SignWithLens:setAccToken', res.errMsg)
            Alert.alert(res.errMsg)
            logout()
          }
        })
        .catch(err => {
          console.error('SignWithLens:sign', err)
          Alert.alert(err)
          logout()
        })
  }, [signer?.address])

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
        <Text style={{ fontSize: 16 }}>Signing with Lens...</Text>
      </View>
    </Container>
  )
}

export default SignWithLens

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
})
