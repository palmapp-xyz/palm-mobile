import useFsChannel from 'hooks/firestore/useFsChannel'
import { Routes } from 'libs/navigation'
import React, { ReactElement } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'

import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import { createGroupChannelSettingsFragment, useSendbirdChat } from '@sendbird/uikit-react-native'
import { MenuBarProps } from '@sendbird/uikit-react-native-foundation'

import { useAppNavigation } from '../../../hooks/useAppNavigation'
import GroupChannelSettingsInfo from './GroupChannelSettingsInfo'

const GroupChannelSettingsFragment = createGroupChannelSettingsFragment({
  Info: GroupChannelSettingsInfo,
})
const GroupChannelSettingsScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannelSettings>()

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, params.channelUrl)
  const { fsChannel } = useFsChannel({
    channelUrl: params.channelUrl,
  })
  if (!channel) {
    return <></>
  }

  return (
    <GroupChannelSettingsFragment
      channel={channel}
      onPressHeaderLeft={(): void => {
        // Navigate back
        navigation.goBack()
      }}
      onPressMenuModeration={(): void => {
        // Navigate to group channel moderation
        navigation.push(Routes.GroupChannelModeration, params)
      }}
      onPressMenuMembers={(): void => {
        // Navigate to group channel members
        navigation.push(Routes.GroupChannelMembers, params)
      }}
      onPressMenuLeaveChannel={(): void => {
        // Navigate to group channel list
        fsChannel?.delete()
        navigation.navigate(Routes.GroupChannelList)
      }}
      onPressMenuNotification={(): void => {
        // Navigate to group channel notifications
        navigation.navigate(Routes.GroupChannelNotifications, params)
      }}
      menuItemsCreator={(items: MenuBarProps[]): MenuBarProps[] => {
        if (channel.myRole === 'operator') {
          items.unshift({
            icon: 'ban',
            name: 'Token Gating',
            actionItem: <Icon name={'chevron-forward-outline'} size={28} />,
            onPress: () => {
              navigation.navigate(Routes.ChannelTokenGating, params)
            },
          })
        }

        items.unshift({
          icon: 'archive',
          name: 'Listings',
          actionItem: <Icon name={'chevron-forward-outline'} size={28} />,
          onPress: () => {
            navigation.navigate(Routes.ChannelListings, params)
          },
        })
        return items
      }}
    />
  )
}

export default GroupChannelSettingsScreen
