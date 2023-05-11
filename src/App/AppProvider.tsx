import useWeb3Bindings from 'hooks/complex/useWeb3Bindings'
import useSetting from 'hooks/independent/useSetting'
import useAppearance from 'hooks/useAppearance'
import { asyncStorageProvider } from 'libs/asyncStorageProvider'
import { navigationActions, Routes } from 'libs/navigation'
import {
  ClipboardService,
  FileService,
  GetTranslucent,
  MediaService,
  NotificationService,
  SetSendbirdSDK,
} from 'libs/sendbird'
import { isMainnet } from 'libs/utils'
import React, { ReactElement, ReactNode } from 'react'
import Config from 'react-native-config'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { MenuProvider } from 'react-native-popup-menu'
import { QueryClient, QueryClientProvider } from 'react-query'
import { RecoilRoot } from 'recoil'
import { SupportedNetworkEnum } from 'types'

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { LensConfig, LensProvider, production } from '@lens-protocol/react'
import {
  Environment,
  LensProvider as LensUIProvider,
  Theme,
} from '@lens-protocol/react-native-lens-ui-kit'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SendbirdUIKitContainer } from '@sendbird/uikit-react-native'
import {
  DarkUIKitTheme,
  LightUIKitTheme,
} from '@sendbird/uikit-react-native-foundation'

import { ErrorInfoScreen } from '../screens'

const AppProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const { setting } = useSetting()
  const { scheme } = useAppearance()
  const { bindings } = useWeb3Bindings(SupportedNetworkEnum.POLYGON)

  const isLightTheme = scheme === 'light'

  const lensEnv = isMainnet() ? Environment.mainnet : Environment.testnet

  const lensConfig: LensConfig = {
    bindings,
    environment: production,
    storage: asyncStorageProvider(),
  }

  const client = new ApolloClient({
    uri: Config.LENS_API,
    cache: new InMemoryCache(),
  })

  return (
    <LensProvider config={lensConfig}>
      <LensUIProvider
        environment={lensEnv}
        theme={setting.themeMode === 'dark' ? Theme.dark : Theme.light}
      >
        <ApolloProvider client={client}>
          <MenuProvider>
            <SendbirdUIKitContainer
              appId={Config.SENDBIRD_APP_ID || ''}
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
              }}
            >
              <GestureHandlerRootView style={{ flex: 1 }}>
                <KeyboardProvider>{children}</KeyboardProvider>
              </GestureHandlerRootView>
            </SendbirdUIKitContainer>
          </MenuProvider>
        </ApolloProvider>
      </LensUIProvider>
    </LensProvider>
  )
}

const queryClient = new QueryClient()

const AppProviderWrapper = ({
  children,
}: {
  children: ReactNode
}): ReactElement => {
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <AppProvider>{children}</AppProvider>
      </RecoilRoot>
    </QueryClientProvider>
  )
}

export default AppProviderWrapper
