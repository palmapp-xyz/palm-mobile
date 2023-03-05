import React, { ReactElement } from 'react'

import { useSendbirdChat } from '@sendbird/uikit-react-native'
import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import { Text, TouchableOpacity } from 'react-native'

const GroupChannelItem = ({
  channelUrl,
}: {
  channelUrl?: string
}): ReactElement => {
  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, channelUrl ?? '')
  const { navigation } = useAppNavigation<Routes.GroupChannelList>()

  if (!channel) {
    return <></>
  }

  return (
    <TouchableOpacity
      style={{ width: '100%', padding: 12 }}
      onPress={(): void => {
        if (!channelUrl || !channel) {
          return
        }
        navigation.navigate(Routes.GroupChannel, { channelUrl })
      }}>
      <Text>{channel.name}</Text>
    </TouchableOpacity>
  )
}

export default GroupChannelItem
