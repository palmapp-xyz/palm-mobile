import React, { ReactElement, ReactNode } from 'react'
import { RecoilRoot } from 'recoil'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

const queryClient = new QueryClient()

const client = new ApolloClient({
  uri: 'https://api.lens.dev',
  cache: new InMemoryCache(),
})

const AppProvider = ({ children }: { children: ReactNode }): ReactElement => {
  return (
    <ApolloProvider client={client}>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </RecoilRoot>
    </ApolloProvider>
  )
}

export default AppProvider
