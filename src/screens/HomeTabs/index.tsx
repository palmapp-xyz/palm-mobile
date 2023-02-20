import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React, { ReactElement } from 'react'

import { useTotalUnreadMessageCount } from '@sendbird/uikit-chat-hooks'
import { useSendbirdChat } from '@sendbird/uikit-react-native'
import { Icon, useUIKitTheme } from '@sendbird/uikit-react-native-foundation'

import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'

import GroupChannelListScreen from './GroupChannelListScreen'
import MyPageScreen from './MyPageScreen'
import FeedScreen from './FeedScreen'

const Tab = createBottomTabNavigator()

const HomeTabs = (): ReactElement => {
  const { params } = useAppNavigation<Routes.HomeTabs>()

  const { colors, typography } = useUIKitTheme()
  const { sdk } = useSendbirdChat()
  const totalUnreadMessages = useTotalUnreadMessageCount(sdk)

  return (
    <Tab.Navigator
      initialRouteName={Routes.Feed}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarLabelStyle: typography.caption2,
      }}>
      <Tab.Screen
        name={Routes.Feed}
        component={FeedScreen}
        options={{
          tabBarLabel: 'Feed',
          tabBarIcon: ({ color }) => <Icon icon={'members'} color={color} />,
        }}
      />
      <Tab.Screen
        name={Routes.GroupChannelList}
        component={GroupChannelListScreen}
        initialParams={params}
        options={{
          tabBarLabel: 'Channels',
          tabBarBadge:
            totalUnreadMessages === '0' ? undefined : totalUnreadMessages,
          tabBarIcon: ({ color }) => (
            <Icon icon={'chat-filled'} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={Routes.MyPage}
        component={MyPageScreen}
        options={{
          tabBarLabel: 'MyPage',
          tabBarIcon: ({ color }) => <Icon icon={'user'} color={color} />,
        }}
      />
    </Tab.Navigator>
  )
}

export default HomeTabs
