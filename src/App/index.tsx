import Loading from 'components/atoms/Loading'
import React, { ReactElement } from 'react'
import { LogBox } from 'react-native'

import useCodePush from 'hooks/useCodePush'
import Navigation from '../Navigation'
import UpdateScreen from '../screens/UpdateScreen'
import AppProviderWrapper from './AppProvider'

const App = (): ReactElement => {
  LogBox.ignoreAllLogs()

  const codepush = useCodePush()

  return (
    <AppProviderWrapper>
      {codepush.updateAvailable === undefined ? (
        <></>
      ) : codepush.updateAvailable === true ? (
        <UpdateScreen {...codepush} />
      ) : (
        <>
          <Loading />
          <Navigation />
        </>
      )}
    </AppProviderWrapper>
  )
}

export default App
