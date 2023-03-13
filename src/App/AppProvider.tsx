import React, { ReactElement, ReactNode } from 'react'
import { RecoilRoot } from 'recoil'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

import Config from 'react-native-config'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MenuProvider } from 'react-native-popup-menu'

import {
  LensProvider,
  Environment,
  Theme,
} from '@lens-protocol/react-native-lens-ui-kit'

import { SendbirdUIKitContainer } from '@sendbird/uikit-react-native'
import {
  DarkUIKitTheme,
  LightUIKitTheme,
} from '@sendbird/uikit-react-native-foundation'

import { navigationActions, Routes } from 'libs/navigation'
import {
  SetSendbirdSDK,
  FileService,
  NotificationService,
  ClipboardService,
  MediaService,
  GetTranslucent,
} from 'libs/sendbird'
import { ErrorInfoScreen } from '../screens'
import useAppearance from 'hooks/useAppearance'
import useSetting from 'hooks/independent/useSetting'
import { ChainNetworkEnum } from 'types'

const AppProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const { setting } = useSetting()
  const { scheme } = useAppearance()
  const isLightTheme = scheme === 'light'

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

  const APP_ID =
    setting.network === ChainNetworkEnum.ETHEREUM
      ? Config.SENDBIRD_APP_ID_ETHEREUM
      : Config.SENDBIRD_APP_ID_GOERLI

  return (
    <LensProvider
      environment={lensEnv}
      theme={setting.themeMode === 'dark' ? Theme.dark : Theme.light}>
      <ApolloProvider client={client}>
        <RecoilRoot>
          <MenuProvider>
            <SendbirdUIKitContainer
              appId={APP_ID || ''}
              chatOptions={{
                localCacheStorage: AsyncStorage,
                onInitialized: SetSendbirdSDK,
                enableAutoPushTokenRegistration: true,
                enableChannelListTypingIndicator: true,
                enableChannelListMessageReceiptStatus: true,
                enableUserMention: true,
              }}
              platformServices={{
                file: FileService,
                notification: NotificationService,
                clipboard: ClipboardService,
                media: MediaService,
              }}
              styles={{
                defaultHeaderTitleAlign: 'left', //'center',
                theme: isLightTheme ? LightUIKitTheme : DarkUIKitTheme,
                statusBarTranslucent: GetTranslucent(),
              }}
              errorBoundary={{ ErrorInfoComponent: ErrorInfoScreen }}
              userProfile={{
                onCreateChannel: (channel): void => {
                  if (channel.isGroupChannel()) {
                    navigationActions.push(Routes.GroupChannel, {
                      channelUrl: channel.url,
                    })
                  }
                },
              }}>
              {children}
            </SendbirdUIKitContainer>
          </MenuProvider>
        </RecoilRoot>
      </ApolloProvider>
    </LensProvider>
  )
}

export default AppProvider
