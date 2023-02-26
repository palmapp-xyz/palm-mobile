import React, { ReactElement } from 'react'

import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import {
  createGroupChannelSettingsFragment,
  useSendbirdChat,
} from '@sendbird/uikit-react-native'

import { useAppNavigation } from '../../hooks/useAppNavigation'
import { Routes } from 'libs/navigation'

const GroupChannelSettingsFragment = createGroupChannelSettingsFragment()
const GroupChannelSettingsScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannelSettings>()

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, params.channelUrl)
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
        navigation.navigate(Routes.GroupChannelList)
      }}
      onPressMenuNotification={(): void => {
        // Navigate to group channel notifications
        navigation.navigate(Routes.GroupChannelNotifications, params)
      }}
    />
  )
}

export default GroupChannelSettingsScreen
