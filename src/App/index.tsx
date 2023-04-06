import React, { ReactElement } from 'react'

import AppProvider from './AppProvider'
import Navigation from '../Navigation'
import { LogBox } from 'react-native'
import { useAsyncEffect } from '@sendbird/uikit-utils'
import { QueryClient, QueryClientProvider } from 'react-query'
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore'
import Loading from 'components/atoms/Loading'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      retry: false,
    },
  },
})

const App = (): ReactElement => {
  LogBox.ignoreAllLogs()
  useAsyncEffect(async () => {
    const setting: FirebaseFirestoreTypes.Settings = { persistence: false }
    await firestore().settings(setting)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Loading />
        <Navigation />
      </AppProvider>
    </QueryClientProvider>
  )
}

export default App
