import Loading from 'palm-react-native-ui-kit/components/atoms/Loading'
import Navigation from 'palm-react-native-ui-kit/Navigation'
import UpdateScreen from 'palm-react-native-ui-kit/screens/app/UpdateScreen'
import useCodePush from 'palm-react/hooks/app/useCodePush'
import React, { ReactElement } from 'react'
import { Keyboard, LogBox, TouchableWithoutFeedback } from 'react-native'

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
