import useWeb3Auth from 'palm-react/hooks/independent/useWeb3Auth'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { Button, useUIKitTheme } from '@sendbird/uikit-react-native-foundation'

import Versions from '../../components/Versions'

// import { Routes } from 'palm-core/libs/navigation'

const Web3AuthScreen = (): ReactElement => {
  // const { navigation } = useAppNavigation()
  const { t } = useTranslation()

  const { loading, login } = useWeb3Auth(async () => {
    // navigation.navigate(Routes.Sign4Auth)
  })
  const { colors } = useUIKitTheme()

  if (loading) {
    return <></>
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Button
        style={styles.btn}
        variant={'contained'}
        onPress={async (): Promise<void> => {
          await login(async () => {
            // navigation.navigate(Routes.Sign4Auth)
          })
        }}
      >
        {t('Auth.Web3Auth')}
      </Button>

      <Versions style={styles.version} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    position: 'absolute',
    width: 48,
    height: 48,
    top: '35%',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 34,
  },
  btn: {
    position: 'absolute',
    width: '80%',
    bottom: '20%',
    paddingVertical: 16,
  },
  version: {
    position: 'absolute',
    bottom: '10%',
  },
  input: {
    width: '100%',
    borderRadius: 4,
    marginBottom: 32,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
})

export default Web3AuthScreen
