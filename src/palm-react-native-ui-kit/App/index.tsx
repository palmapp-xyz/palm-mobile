import Loading from 'palm-react-native-ui-kit/components/atoms/Loading'
import useCodePush from 'palm-react/hooks/useCodePush'
import React, { ReactElement } from 'react'
import { Keyboard, LogBox, TouchableWithoutFeedback } from 'react-native'

import Navigation from '../Navigation'
import UpdateScreen from '../screens/UpdateScreen'
import AppProviderWrapper from './AppProvider'

const App = (): ReactElement => {
  LogBox.ignoreAllLogs()

  const codepush = useCodePush()

  return (
    <AppProviderWrapper>
      <TouchableWithoutFeedback onPress={(): void => Keyboard.dismiss()}>
        {!codepush.upToDate ? (
          <UpdateScreen {...codepush} />
        ) : (
          <>
            <Loading />
            <Navigation />
          </>
        )}
      </TouchableWithoutFeedback>
    </AppProviderWrapper>
  )
}

export default App
