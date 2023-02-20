import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native'
import React, { ReactElement, useEffect } from 'react'
import Config from 'react-native-config'
import {
  SendbirdUIKitContainer,
  useSendbirdChat,
} from '@sendbird/uikit-react-native'
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
  RootStack,
  SetSendbirdSDK,
} from '../libs/sendbird'
import useAppearance from '../hooks/useAppearance'
import { Routes, navigationActions, navigationRef } from '../libs/navigation'
import { onForegroundAndroid, onForegroundIOS } from '../libs/notification'
import {
  ErrorInfoScreen,
  GroupChannelBannedUsersScreen,
  GroupChannelCreateScreen,
  GroupChannelInviteScreen,
  GroupChannelMembersScreen,
  GroupChannelModerationScreen,
  GroupChannelMutedMembersScreen,
  GroupChannelNotificationsScreen,
  GroupChannelOperatorsScreen,
  GroupChannelRegisterOperatorScreen,
  GroupChannelScreen,
  GroupChannelSettingsScreen,
  GroupChannelTabs,
  HomeScreen,
  SignInScreen,
  Web3AuthScreen,
  MainAccountScreen,
  NewAccountScreen,
  RecoverAccountScreen,
} from '../screens'
import FileViewerScreen from '../screens/uikit-app/FileViewerScreen'

import AppProvider from './AppProvider'

const APP_ID = Config.SENDBIRD_APP_ID || ''

const App = (): ReactElement => {
  const { scheme } = useAppearance()
  const isLightTheme = scheme === 'light'
  console.log('APP_ID : ', APP_ID)
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
        <Navigations />
      </SendbirdUIKitContainer>
    </AppProvider>
  )
}

const Navigations = (): ReactElement => {
  const { currentUser } = useSendbirdChat()
  const { scheme } = useAppearance()
  const isLightTheme = scheme === 'light'

  useEffect(() => {
    const unsubscribes = [onForegroundAndroid(), onForegroundIOS()]
    return () => {
      unsubscribes.forEach(fn => fn())
    }
  }, [])

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={isLightTheme ? DefaultTheme : DarkTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!currentUser ? (
          <>
            <RootStack.Screen
              name={Routes.MainAccount}
              component={MainAccountScreen}
            />
            <RootStack.Screen
              name={Routes.NewAccount}
              component={NewAccountScreen}
            />
            <RootStack.Screen
              name={Routes.RecoverAccount}
              component={RecoverAccountScreen}
            />
            <RootStack.Screen name={Routes.SignIn} component={SignInScreen} />
            <RootStack.Screen
              name={Routes.Web3Auth}
              component={Web3AuthScreen}
            />
          </>
        ) : (
          <>
            <RootStack.Screen name={Routes.Home} component={HomeScreen} />

            <RootStack.Screen
              name={Routes.GroupChannelTabs}
              component={GroupChannelTabs}
            />
            <RootStack.Screen
              name={Routes.GroupChannel}
              component={GroupChannelScreen}
            />
            <RootStack.Group>
              <RootStack.Screen
                name={Routes.GroupChannelSettings}
                component={GroupChannelSettingsScreen}
              />
              <RootStack.Screen
                name={Routes.GroupChannelNotifications}
                component={GroupChannelNotificationsScreen}
              />
              <RootStack.Screen
                name={Routes.GroupChannelMembers}
                component={GroupChannelMembersScreen}
              />
              <RootStack.Screen
                name={Routes.GroupChannelModeration}
                component={GroupChannelModerationScreen}
              />
              <RootStack.Screen
                name={Routes.GroupChannelMutedMembers}
                component={GroupChannelMutedMembersScreen}
              />
              <RootStack.Screen
                name={Routes.GroupChannelBannedUsers}
                component={GroupChannelBannedUsersScreen}
              />
              <RootStack.Group>
                <RootStack.Screen
                  name={Routes.GroupChannelOperators}
                  component={GroupChannelOperatorsScreen}
                />
                <RootStack.Screen
                  name={Routes.GroupChannelRegisterOperator}
                  component={GroupChannelRegisterOperatorScreen}
                />
              </RootStack.Group>
            </RootStack.Group>
            <RootStack.Screen
              name={Routes.GroupChannelCreate}
              component={GroupChannelCreateScreen}
            />
            <RootStack.Screen
              name={Routes.GroupChannelInvite}
              component={GroupChannelInviteScreen}
            />

            <RootStack.Group
              screenOptions={{
                animation: 'slide_from_bottom',
                headerShown: false,
              }}>
              <RootStack.Screen
                name={Routes.FileViewer}
                component={FileViewerScreen}
              />
            </RootStack.Group>
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

export default App
