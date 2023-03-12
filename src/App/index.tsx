import React, { ReactElement } from 'react'

import AppProvider from './AppProvider'
import Navigation from '../Navigation'
import { LogBox } from 'react-native'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

const App = (): ReactElement => {
  LogBox.ignoreAllLogs()
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Navigation />
      </AppProvider>
    </QueryClientProvider>
  )
}

export default App
