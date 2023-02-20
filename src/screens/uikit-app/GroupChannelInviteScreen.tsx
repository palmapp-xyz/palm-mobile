import React, { ReactElement } from 'react'

import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import {
  createGroupChannelInviteFragment,
  useSendbirdChat,
} from '@sendbird/uikit-react-native'
import type { SendbirdUser } from '@sendbird/uikit-utils'

import { useAppNavigation } from '../../hooks/useAppNavigation'
import { Routes } from 'libs/navigation'

const GroupChannelInviteFragment =
  createGroupChannelInviteFragment<SendbirdUser>()

const GroupChannelInviteScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannelInvite>()

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, params.channelUrl)
  if (!channel) {
    return <></>
  }

  return (
    <GroupChannelInviteFragment
      channel={channel}
      onPressHeaderLeft={(): void => {
        navigation.goBack()
      }}
      onInviteMembers={(_channel): void => {
        navigation.navigate(Routes.GroupChannel, { channelUrl: _channel.url })
      }}
    />
  )
}

export default GroupChannelInviteScreen
