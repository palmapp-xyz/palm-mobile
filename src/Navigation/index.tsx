import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native'
import React, { ReactElement, useEffect } from 'react'

import { RootStack } from '../libs/sendbird'
import useAppearance from '../hooks/useAppearance'
import { Routes, navigationRef } from '../libs/navigation'
import { onForegroundAndroid, onForegroundIOS } from '../libs/notification'
import {
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
  Web3AuthScreen,
  MainAccountScreen,
  NewAccountScreen,
  RecoverAccountScreen,
  HomeTabs,
  SettingScreen,
  ZxNftDetailScreen,
  SendNftScreen,
  ListNftScreen,
  NftDetailScreen,
  ChannelListingsScreen,
  ChannelTokenGatingScreen,
  SignWithLens,
  UserProfileScreen,
} from '../screens'
import FileViewerScreen from '../screens/uikit-app/FileViewerScreen'
import useAuth from 'hooks/independent/useAuth'
// import Sign4AuthScreen from '../screens/Sign4AuthScreen'
import PostTxResult from './PostTxResult'

const Navigation = (): ReactElement => {
  const { user } = useAuth()
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
        {user?.accessToken ? (
          <>
            <RootStack.Screen name={Routes.HomeTabs} component={HomeTabs} />

            <RootStack.Screen
              name={Routes.ZxNftDetail}
              component={ZxNftDetailScreen}
            />
            <RootStack.Screen
              name={Routes.NftDetail}
              component={NftDetailScreen}
            />
            <RootStack.Screen
              name={Routes.ChannelListings}
              component={ChannelListingsScreen}
            />
            <RootStack.Screen
              name={Routes.ChannelTokenGating}
              component={ChannelTokenGatingScreen}
            />

            <RootStack.Screen
              name={Routes.UserProfile}
              component={UserProfileScreen}
            />

            <RootStack.Screen name={Routes.SendNft} component={SendNftScreen} />

            <RootStack.Screen name={Routes.ListNft} component={ListNftScreen} />

            <RootStack.Screen name={Routes.Setting} component={SettingScreen} />
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
        ) : user ? (
          <RootStack.Screen
            name={Routes.MainAccount}
            component={SignWithLens}
          />
        ) : (
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
            <RootStack.Screen
              name={Routes.Web3Auth}
              component={Web3AuthScreen}
            />
          </>
        )}
      </RootStack.Navigator>
      <PostTxResult />
    </NavigationContainer>
  )
}

export default Navigation
