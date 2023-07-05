import { recordError } from 'palm-core/libs/logger'
import { Container, FormText } from 'palm-react-native-ui-kit/components'
import useAuth from 'palm-react/hooks/auth/useAuth'
import LensLogo from 'palm-ui-kit/assets/LensLogo'
import React, { ReactElement, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import RNRestart from 'react-native-restart'

import { useAlert } from '@sendbird/uikit-react-native-foundation'

const SignInWithLens = (): ReactElement => {
  const { lensLogin, logout } = useAuth()
  const { alert } = useAlert()
  const { t } = useTranslation()

  useEffect(() => {
    lensLogin().then(res => {
      if (!res.success) {
        recordError(new Error(res.errMsg), 'SignInWithLens:lensLogin')
        alert({
          title: t('Auth.SignLensFailureAlertTitle'),
          message: res.errMsg,
        })
        logout(() => RNRestart.restart())
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
        <FormText size={16}>{t('Auth.SignLensLoading')}</FormText>
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
