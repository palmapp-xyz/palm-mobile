import React, { ReactElement, ReactNode } from 'react'
import { RecoilRoot } from 'recoil'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { MenuProvider } from 'react-native-popup-menu'
import Config from 'react-native-config'
import useSetting from 'hooks/independent/useSetting'
import { ChainNetworkEnum } from 'types'
import {
  LensProvider,
  Environment,
  Theme,
} from '@lens-protocol/react-native-lens-ui-kit'

const AppProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const { setting } = useSetting()

  console.log(setting)

  const lensEnv =
    setting.network === ChainNetworkEnum.ETHEREUM
      ? Environment.mainnet
      : Environment.testnet

  const client = new ApolloClient({
    uri:
      setting.network === ChainNetworkEnum.ETHEREUM
        ? Config.LENS_API_ETHEREUM
        : Config.LENS_API_GOERLI,
    cache: new InMemoryCache(),
  })

  return (
    <LensProvider
      environment={lensEnv}
      theme={setting.themeMode === 'dark' ? Theme.dark : Theme.light}>
      <ApolloProvider client={client}>
        <RecoilRoot>
          <MenuProvider>{children}</MenuProvider>
        </RecoilRoot>
      </ApolloProvider>
    </LensProvider>
  )
}

export default AppProvider
