import { COLOR } from 'palm-core/consts'
import { Routes } from 'palm-core/libs/navigation'
import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import React, { ReactElement, useEffect } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useTotalUnreadMessageCount } from '@sendbird/uikit-chat-hooks'
import { useSendbirdChat } from '@sendbird/uikit-react-native'
import PkeyManager from 'palm-react-native/app/pkeyManager'

import Notifee from '@notifee/react-native'
import GroupChannelListScreen from '../../channels/GroupChannelListScreen'
import ExploreScreen from '../../explore/ExploreScreen'
import MyPageScreen from '../../profiles/MyPageScreen'
const Tab = createBottomTabNavigator()

const TabIcon =
  ({ name }: { name: string }) =>
  ({ focused }: { focused: boolean }): ReactElement =>
    (
      <Icon
        name={focused ? name : `${name}-outline`}
        size={24}
        color={focused ? COLOR.primary._400 : COLOR.black._700}
      />
    )

const HomeTabs = (): ReactElement => {
  const { params, navigation } = useAppNavigation<Routes.HomeTabs>()

  const { sdk } = useSendbirdChat()
  const totalUnreadMessages = useTotalUnreadMessageCount(sdk)

  useEffect(() => {
    const checkPin = async (): Promise<void> => {
      const isPinConfigured = (await PkeyManager.getPin()) !== ''

      if (!isPinConfigured) {
        navigation.navigate(Routes.Pin, {
          type: 'set',
          result: async (result: boolean): Promise<void> => {
            result && navigation.pop()
            return Promise.resolve()
          },
        })
      }
    }
    setTimeout(checkPin, 100)
  }, [])

  useEffect(() => {
    const badgeCount = parseInt(totalUnreadMessages, 10)
    !Number.isNaN(badgeCount) && Notifee.setBadgeCount(badgeCount)
  }, [totalUnreadMessages])

  return (
    <Tab.Navigator
      initialRouteName={Routes.Explore}
      screenOptions={{
        lazy: true,
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name={Routes.Explore}
        component={ExploreScreen}
        options={{ tabBarIcon: TabIcon({ name: 'ios-search' }) }}
      />
      {/* <Tab.Screen
        name={Routes.LensFriends}
        component={LensFriendsScreen}
        options={{ tabBarIcon: TabIcon({ name: 'ios-people' }) }}
      /> */}
      <Tab.Screen
        name={Routes.GroupChannelList}
        component={GroupChannelListScreen}
        initialParams={params}
        options={{
          tabBarLabel: 'Channels',
          tabBarBadge:
            totalUnreadMessages === '0' ? undefined : totalUnreadMessages,
          tabBarIcon: TabIcon({ name: 'ios-chatbubbles' }),
        }}
      />
      <Tab.Screen
        name={Routes.MyPage}
        component={MyPageScreen}
        options={{
          tabBarLabel: 'MyPage',
          tabBarIcon: TabIcon({ name: 'ios-person-circle' }),
        }}
      />
    </Tab.Navigator>
  )
}

export default HomeTabs
