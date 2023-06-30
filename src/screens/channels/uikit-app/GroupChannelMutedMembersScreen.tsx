import React, { ReactElement } from 'react'

import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import {
  createGroupChannelMutedMembersFragment,
  useSendbirdChat,
} from '@sendbird/uikit-react-native'

import { useAppNavigation } from '../../../hooks/useAppNavigation'

import type { Routes } from 'core/libs/navigation'

const GroupChannelMutedMembersFragment =
  createGroupChannelMutedMembersFragment()
const GroupChannelMutedMembersScreen = (): ReactElement => {
  const { navigation, params } =
    useAppNavigation<Routes.GroupChannelMutedMembers>()

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, params.channelUrl)
  if (!channel) {
    return <></>
  }

  return (
    <GroupChannelMutedMembersFragment
      channel={channel}
      onPressHeaderLeft={(): void => {
        // Navigate back
        navigation.goBack()
      }}
    />
  )
}

export default GroupChannelMutedMembersScreen
