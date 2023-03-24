import React, { ReactElement } from 'react'

import AppProvider from './AppProvider'
import Navigation from '../Navigation'
import { LogBox } from 'react-native'
import { useAsyncEffect } from '@sendbird/uikit-utils'
import { QueryClient, QueryClientProvider } from 'react-query'
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore'

const queryClient = new QueryClient()

const App = (): ReactElement => {
  LogBox.ignoreAllLogs()
  useAsyncEffect(async () => {
    const setting: FirebaseFirestoreTypes.Settings = { persistence: false }
    await firestore().settings(setting)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Navigation />
      </AppProvider>
    </QueryClientProvider>
  )
}

export default App
