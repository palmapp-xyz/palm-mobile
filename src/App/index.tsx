import React, { ReactElement } from 'react'
import { LogBox } from 'react-native'

import Navigation from '../Navigation'
import Loading from 'components/atoms/Loading'
import AppProviderWrapper from './AppProvider'

const App = (): ReactElement => {
  LogBox.ignoreAllLogs()

  return (
    <AppProviderWrapper>
      <Loading />
      <Navigation />
    </AppProviderWrapper>
  )
}

export default App
