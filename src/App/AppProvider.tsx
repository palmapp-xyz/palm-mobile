import React, { ReactElement, ReactNode } from 'react'
import { RecoilRoot } from 'recoil'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { MenuProvider } from 'react-native-popup-menu'

const queryClient = new QueryClient()

const client = new ApolloClient({
  uri: 'https://api-mumbai.lens.dev/',
  cache: new InMemoryCache(),
})

const AppProvider = ({ children }: { children: ReactNode }): ReactElement => {
  return (
    <ApolloProvider client={client}>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <MenuProvider>{children}</MenuProvider>
        </QueryClientProvider>
      </RecoilRoot>
    </ApolloProvider>
  )
}

export default AppProvider
