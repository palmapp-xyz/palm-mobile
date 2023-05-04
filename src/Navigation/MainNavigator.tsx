import useAuth from 'hooks/auth/useAuth'
import useProfile from 'hooks/auth/useProfile'
import { Routes } from 'libs/navigation'
import React, { ReactElement } from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import {
  ChannelListingsScreen,
  ChannelSettingScreen,
  CreateChannelScreen,
  CreateProfileScreen,
  EditChannelScreen,
  FileViewerScreen,
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
  HomeTabs,
  InitExploreScreen,
  ListNftScreen,
  NftDetailScreen,
  SendNftScreen,
  SettingScreen,
  TokenGatingInfoScreen,
  UpdateLensProfileScreen,
  UserProfileScreen,
  ZxNftDetailScreen,
} from '../screens'

const MainStack = createNativeStackNavigator()

const MainNavigator = (): ReactElement => {
  const { user } = useAuth()
  const { profile } = useProfile({ profileId: user?.auth?.profileId })

  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      {profile?.handle ? (
        <>
          <MainStack.Screen name={Routes.HomeTabs} component={HomeTabs} />
          <MainStack.Screen
            name={Routes.InitExplore}
            component={InitExploreScreen}
            options={{ gestureEnabled: false }}
          />
          <MainStack.Screen
            name={Routes.ZxNftDetail}
            component={ZxNftDetailScreen}
          />
          <MainStack.Screen
            name={Routes.NftDetail}
            component={NftDetailScreen}
          />
          <MainStack.Screen
            name={Routes.ChannelListings}
            component={ChannelListingsScreen}
          />
          <MainStack.Screen
            name={Routes.UserProfile}
            component={UserProfileScreen}
          />
          <MainStack.Screen
            name={Routes.UpdateLensProfile}
            component={UpdateLensProfileScreen}
          />
          <MainStack.Screen name={Routes.SendNft} component={SendNftScreen} />
          <MainStack.Screen name={Routes.ListNft} component={ListNftScreen} />
          <MainStack.Screen name={Routes.Setting} component={SettingScreen} />
          <MainStack.Group>
            <MainStack.Screen
              name={Routes.GroupChannel}
              component={GroupChannelScreen}
            />
            <MainStack.Screen
              name={Routes.TokenGatingInfo}
              component={TokenGatingInfoScreen}
            />
          </MainStack.Group>
          <MainStack.Group>
            <MainStack.Screen
              name={Routes.GroupChannelSettings}
              component={GroupChannelSettingsScreen}
            />
            <MainStack.Screen
              name={Routes.GroupChannelNotifications}
              component={GroupChannelNotificationsScreen}
            />
            <MainStack.Screen
              name={Routes.GroupChannelMembers}
              component={GroupChannelMembersScreen}
            />
            <MainStack.Screen
              name={Routes.GroupChannelModeration}
              component={GroupChannelModerationScreen}
            />
            <MainStack.Screen
              name={Routes.GroupChannelMutedMembers}
              component={GroupChannelMutedMembersScreen}
            />
            <MainStack.Screen
              name={Routes.GroupChannelBannedUsers}
              component={GroupChannelBannedUsersScreen}
            />
            <MainStack.Group>
              <MainStack.Screen
                name={Routes.GroupChannelOperators}
                component={GroupChannelOperatorsScreen}
              />
              <MainStack.Screen
                name={Routes.GroupChannelRegisterOperator}
                component={GroupChannelRegisterOperatorScreen}
              />
            </MainStack.Group>
          </MainStack.Group>
          <MainStack.Screen
            name={Routes.GroupChannelCreate}
            component={GroupChannelCreateScreen}
          />
          <MainStack.Screen
            name={Routes.GroupChannelInvite}
            component={GroupChannelInviteScreen}
          />
          <MainStack.Group
            screenOptions={{
              animation: 'slide_from_bottom',
              headerShown: false,
            }}
          >
            <MainStack.Screen
              name={Routes.FileViewer}
              component={FileViewerScreen}
            />
          </MainStack.Group>
          <MainStack.Screen
            name={Routes.CreateChannel}
            component={CreateChannelScreen}
          />
          <MainStack.Screen
            name={Routes.EditChannel}
            component={EditChannelScreen}
          />
          <MainStack.Screen
            name={Routes.ChannelSetting}
            component={ChannelSettingScreen}
          />
        </>
      ) : (
        <MainStack.Screen
          name={'CreateProfile'}
          component={CreateProfileScreen}
        />
      )}
    </MainStack.Navigator>
  )
}

export default MainNavigator
