import { UTIL } from 'palm-core/libs'
import { navigationActions, Routes } from 'palm-core/libs/navigation'
import { SetSendbirdSDK } from 'palm-core/libs/sendbird'
import { SupportedNetworkEnum } from 'palm-core/types'
// eslint-disable-next-line prettier/prettier
import {
  asyncStorageProvider,
} from 'palm-react-native/app/asyncStorageProvider'
import Config from 'palm-react-native/config'
import {
  ClipboardService,
  FileService,
  GetTranslucent,
  MediaService,
  NotificationService,
} from 'palm-react-native/sendbird'
import useAppearance from 'palm-react/hooks/app/useAppearance'
import useSetting from 'palm-react/hooks/app/useSetting'
import useWeb3Bindings from 'palm-react/hooks/complex/useWeb3Bindings'
import useNotificationConf from 'palm-react/hooks/notification/useNotificationConf'
import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { MenuProvider } from 'react-native-popup-menu'
import { ToastProvider } from 'react-native-toast-notifications'
import { QueryClient, QueryClientProvider } from 'react-query'
import { RecoilRoot } from 'recoil'

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
import {
  defaultToastProviderOptions,
  renderToast,
} from '../screens/app/ToastView'

const AppProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const { setting } = useSetting()
  const { scheme } = useAppearance()
  const { bindings } = useWeb3Bindings(SupportedNetworkEnum.POLYGON)

  const { isNotificationEnabled } = useNotificationConf()
  const [autoPushTokenRegistration, setAutoPushTokenRegistration] =
    useState<boolean>(true)

  useEffect(() => {
    const checkAutoPushTokenRegistration = async (): Promise<void> => {
      const pushEnable = await isNotificationEnabled()
      setAutoPushTokenRegistration(pushEnable)
    }
    checkAutoPushTokenRegistration()
  }, [])

  const isLightTheme = scheme === 'light'

  const lensEnv = UTIL.isMainnet() ? Environment.mainnet : Environment.testnet

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
                enableAutoPushTokenRegistration: autoPushTokenRegistration,
                enableChannelListTypingIndicator: true,
                enableChannelListMessageReceiptStatus: true,
                enableUserMention: true,
                enableMessageSearch: true,
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
        <ToastProvider
          renderToast={renderToast}
          {...defaultToastProviderOptions}
        >
          <AppProvider>{children}</AppProvider>
        </ToastProvider>
      </RecoilRoot>
    </QueryClientProvider>
  )
}

export default AppProviderWrapper
