import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React, { ReactElement } from 'react'
import { useTotalUnreadMessageCount } from '@sendbird/uikit-chat-hooks'
import { useSendbirdChat } from '@sendbird/uikit-react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import { COLOR } from 'consts'

import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'

import GroupChannelListScreen from './GroupChannelListScreen'
import MyPageScreen from './MyPageScreen'
import FeedScreen from './FeedScreen'
import NftListScreen from './NftListScreen'

const Tab = createBottomTabNavigator()

const TabIcon =
  ({ name }: { name: string }) =>
  ({ focused }: { focused: boolean }): ReactElement =>
    (
      <Icon
        name={focused ? name : `${name}-outline`}
        size={24}
        color={focused ? COLOR.primary._400 : COLOR.gray._700}
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
        headerShown: false,
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name={Routes.Feed}
        component={FeedScreen}
        options={{ tabBarIcon: TabIcon({ name: 'ios-people' }) }}
      />
      <Tab.Screen
        name={Routes.NftList}
        component={NftListScreen}
        options={{ tabBarIcon: TabIcon({ name: 'ios-images' }) }}
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
