import React, { ReactElement } from 'react'
import { LogBox } from 'react-native'
import { useAsyncEffect } from '@sendbird/uikit-utils'
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore'

import AppProvider from './AppProvider'
import Navigation from '../Navigation'
import Loading from 'components/atoms/Loading'

const App = (): ReactElement => {
  LogBox.ignoreAllLogs()
  useAsyncEffect(async () => {
    const setting: FirebaseFirestoreTypes.Settings = {
      persistence: process.env.NODE_ENV !== 'development',
    }
    await firestore().settings(setting)
  }, [])

  return (
    <AppProvider>
      <Loading />
      <Navigation />
    </AppProvider>
  )
}

export default App
