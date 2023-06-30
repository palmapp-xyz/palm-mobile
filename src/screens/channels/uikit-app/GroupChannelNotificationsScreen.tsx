import React, { ReactElement } from 'react'

import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import {
  createGroupChannelNotificationsFragment,
  useSendbirdChat,
} from '@sendbird/uikit-react-native'

import { useAppNavigation } from '../../../hooks/useAppNavigation'

import type { Routes } from 'core/libs/navigation'

const GroupChannelNotificationsFragment =
  createGroupChannelNotificationsFragment()
const GroupChannelNotificationsScreen = (): ReactElement => {
  const { params, navigation } =
    useAppNavigation<Routes.GroupChannelNotifications>()
  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, params.channelUrl)

  if (!channel) {
    return <></>
  }

  return (
    <GroupChannelNotificationsFragment
      channel={channel}
      onPressHeaderLeft={(): void => {
        navigation.goBack()
      }}
    />
  )
}

export default GroupChannelNotificationsScreen
