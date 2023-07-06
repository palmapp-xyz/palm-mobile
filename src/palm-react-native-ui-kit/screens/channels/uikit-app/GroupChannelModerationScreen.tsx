import { Routes } from 'palm-core/libs/navigation'
import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import React, { ReactElement } from 'react'

import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import {
  createGroupChannelModerationFragment,
  useSendbirdChat,
} from '@sendbird/uikit-react-native'

const GroupChannelModerationFragment = createGroupChannelModerationFragment()
const GroupChannelModerationScreen = (): ReactElement => {
  const { navigation, params } =
    useAppNavigation<Routes.GroupChannelModeration>()

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, params.channelUrl)
  if (!channel) {
    return <></>
  }

  return (
    <GroupChannelModerationFragment
      channel={channel}
      onPressMenuOperators={(): void => {
        // Navigate to group channel operators
        navigation.push(Routes.GroupChannelOperators, params)
      }}
      onPressMenuMutedMembers={(): void => {
        // Navigate to group channel muted members
        navigation.push(Routes.GroupChannelMutedMembers, params)
      }}
      onPressMenuBannedUsers={(): void => {
        // Navigate to group channel banned users
        navigation.push(Routes.GroupChannelBannedUsers, params)
      }}
      onPressHeaderLeft={(): void => {
        // Navigate back
        navigation.goBack()
      }}
    />
  )
}

export default GroupChannelModerationScreen
