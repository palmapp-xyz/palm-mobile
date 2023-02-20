import AsyncStorage from '@react-native-async-storage/async-storage'

import React, { ReactElement } from 'react'
import Config from 'react-native-config'
import { SendbirdUIKitContainer } from '@sendbird/uikit-react-native'
import {
  DarkUIKitTheme,
  LightUIKitTheme,
} from '@sendbird/uikit-react-native-foundation'

import {
  ClipboardService,
  FileService,
  GetTranslucent,
  MediaService,
  NotificationService,
  SetSendbirdSDK,
} from '../libs/sendbird'
import { Routes, navigationActions } from '../libs/navigation'
import useAppearance from '../hooks/useAppearance'

import { ErrorInfoScreen } from '../screens'
import AppProvider from './AppProvider'
import Navigation from '../Navigation'

const APP_ID = Config.SENDBIRD_APP_ID || ''

const App = (): ReactElement => {
  const { scheme } = useAppearance()
  const isLightTheme = scheme === 'light'
  return (
    <AppProvider>
      <SendbirdUIKitContainer
        appId={APP_ID}
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
        <Navigation />
      </SendbirdUIKitContainer>
    </AppProvider>
  )
}

export default App
