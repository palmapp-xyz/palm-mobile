import Loading from 'components/atoms/Loading'
import React, { ReactElement, useEffect } from 'react'
import { LogBox } from 'react-native'
import CodePush, { CodePushOptions } from 'react-native-code-push'
import SplashScreen from 'react-native-splash-screen'

import Navigation from '../Navigation'
import AppProviderWrapper from './AppProvider'

const codePushOptions: CodePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
  updateDialog: {
    appendReleaseDescription: true,
  },
}

const App = (): ReactElement => {
  LogBox.ignoreAllLogs()

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide()
    }, 1000)
  }, [])

  return (
    <AppProviderWrapper>
      <Loading />
      <Navigation />
    </AppProviderWrapper>
  )
}

export default CodePush(codePushOptions)(App)
