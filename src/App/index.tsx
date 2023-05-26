import Loading from 'components/atoms/Loading'
import React, { ReactElement } from 'react'
import { LogBox } from 'react-native'
import CodePush, { CodePushOptions } from 'react-native-code-push'

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

  return (
    <AppProviderWrapper>
      <Loading />
      <Navigation />
    </AppProviderWrapper>
  )
}

export default CodePush(codePushOptions)(App)
