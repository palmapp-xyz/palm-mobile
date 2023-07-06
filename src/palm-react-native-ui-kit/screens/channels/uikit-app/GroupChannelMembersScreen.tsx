import { Routes } from 'palm-core/libs/navigation'
import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import React, { ReactElement } from 'react'

import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import {
  createGroupChannelMembersFragment,
  useSendbirdChat,
} from '@sendbird/uikit-react-native'

const GroupChannelMembersFragment = createGroupChannelMembersFragment()

const GroupChannelMembersScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannelInvite>()

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, params.channelUrl)
  if (!channel) {
    return <></>
  }

  return (
    <GroupChannelMembersFragment
      channel={channel}
      onPressHeaderLeft={(): void => {
        navigation.goBack()
      }}
      onPressHeaderRight={(): void => {
        navigation.push(Routes.GroupChannelInvite, params)
      }}
    />
  )
}

export default GroupChannelMembersScreen
