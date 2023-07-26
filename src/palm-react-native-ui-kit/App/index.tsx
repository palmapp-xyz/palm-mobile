import * as Sentry from '@sentry/react-native'
import Navigation from 'palm-react-native-ui-kit/Navigation'
import Loading from 'palm-react-native-ui-kit/components/atoms/Loading'
import UpdateScreen from 'palm-react-native-ui-kit/screens/app/UpdateScreen'
import useCodePush from 'palm-react-native/app/useCodePush'
import Config from 'palm-react-native/config'
import React, { ReactElement } from 'react'
import { Keyboard, LogBox, TouchableWithoutFeedback } from 'react-native'
import AppProviderWrapper from './AppProvider'

!__DEV__ &&
  Sentry.init({
    dsn: Config.SENTRY_DSN,
    tracesSampleRate: 1.0,
  })

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

export default Sentry.wrap(App)
