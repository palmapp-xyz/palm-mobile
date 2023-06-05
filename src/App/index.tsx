import Loading from 'components/atoms/Loading'
import React, { ReactElement } from 'react'
import { LogBox } from 'react-native'

import useCodePush from 'hooks/useCodePush'
import Navigation from '../Navigation'
import UpdateScreen from '../screens/UpdateScreen'
import AppProviderWrapper from './AppProvider'

const App = (): ReactElement => {
  LogBox.ignoreAllLogs()

  const { updateAvailable } = useCodePush()

  return (
    <AppProviderWrapper>
      {updateAvailable === undefined ? (
        <></>
      ) : updateAvailable === true ? (
        <UpdateScreen />
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
