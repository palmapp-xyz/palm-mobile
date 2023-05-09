import { COLOR } from 'consts'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import React, { ReactElement } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useTotalUnreadMessageCount } from '@sendbird/uikit-chat-hooks'
import { useSendbirdChat } from '@sendbird/uikit-react-native'

import ExploreScreen from './ExploreScreen'
import GroupChannelListScreen from './GroupChannelListScreen'
import LensFriendsScreen from './LensFriendsScreen'
// import NftListScreen from './NftListScreen'
import MyPageScreen from './MyPageScreen'

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
  const { params } = useAppNavigation<Routes.HomeTabs>()

  const { sdk } = useSendbirdChat()
  const totalUnreadMessages = useTotalUnreadMessageCount(sdk)

  return (
    <Tab.Navigator
      initialRouteName={Routes.GroupChannelList}
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
      <Tab.Screen
        name={Routes.LensFriends}
        component={LensFriendsScreen}
        options={{ tabBarIcon: TabIcon({ name: 'ios-people' }) }}
      />
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
