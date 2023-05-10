import Loading from 'components/atoms/Loading'
import React, { ReactElement, useEffect } from 'react'
import { LogBox } from 'react-native'
import SplashScreen from 'react-native-splash-screen'

import Navigation from '../Navigation'
import AppProviderWrapper from './AppProvider'

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

export default App
