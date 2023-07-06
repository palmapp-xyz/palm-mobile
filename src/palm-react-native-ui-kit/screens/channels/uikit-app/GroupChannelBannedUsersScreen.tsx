import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import React, { ReactElement } from 'react'

import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import {
  createGroupChannelBannedUsersFragment,
  useSendbirdChat,
} from '@sendbird/uikit-react-native'

import type { Routes } from 'palm-core/libs/navigation'

const GroupChannelBannedUsersFragment = createGroupChannelBannedUsersFragment()
const GroupChannelBannedUsersScreen = (): ReactElement => {
  const { navigation, params } =
    useAppNavigation<Routes.GroupChannelBannedUsers>()

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, params.channelUrl)
  if (!channel) {
    return <></>
  }

  return (
    <GroupChannelBannedUsersFragment
      channel={channel}
      onPressHeaderLeft={(): void => {
        // Navigate back
        navigation.goBack()
      }}
    />
  )
}

export default GroupChannelBannedUsersScreen
