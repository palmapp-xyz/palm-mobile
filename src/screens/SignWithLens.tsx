import React, { ReactElement, useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import _ from 'lodash'

import { Container } from 'components'
import LensLogo from 'assets/LensLogo'

import useLens from 'hooks/lens/useLens'
import useAuth from 'hooks/independent/useAuth'
import useLensProfile from 'hooks/lens/useLensProfile'
import useFsProfile from 'hooks/firestore/useFsProfile'

const SignWithLens = (): ReactElement => {
  const { user, setAccToken, logout } = useAuth()
  const { sign } = useLens()
  const [processText, setProcessText] = useState('Signing in with Lens...')

  const { fsProfile } = useFsProfile({ address: user?.address })

  const { profile, isLoading } = useLensProfile({ userAddress: user?.address })

  const setLensProfileToFirebase = async (): Promise<void> => {
    if (profile && fsProfile) {
      setProcessText('Setting Lens profile...')
      await fsProfile.set({
        address: user?.address,
        lensProfile: profile,
        ...profile,
      })
    }
  }

  const initAccToken = async (): Promise<void> => {
    const res = await sign()
    if (res.success) {
      setAccToken(res.value)
    } else {
      console.error('SignWithLens:setAccToken', res.errMsg)
      Alert.alert(res.errMsg)
      logout()
    }
  }

  const init = async (): Promise<void> => {
    try {
      await setLensProfileToFirebase()
      initAccToken()
    } catch (error) {
      console.error('SignWithLens:sign', error)
      Alert.alert(_.toString(error))
      logout()
    }
  }

  useEffect(() => {
    if (isLoading === false && fsProfile) {
      init()
    }
  }, [isLoading, fsProfile])

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
        <Text style={{ fontSize: 16 }}>{processText}</Text>
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
