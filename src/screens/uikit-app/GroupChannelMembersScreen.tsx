import { Routes } from 'libs/navigation'
import React, { ReactElement } from 'react'

import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import { createGroupChannelMembersFragment, useSendbirdChat } from '@sendbird/uikit-react-native'

import { useAppNavigation } from '../../hooks/useAppNavigation'

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
