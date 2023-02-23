import React, { ReactElement } from 'react'
import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import {
  createGroupChannelFragment,
  useSendbirdChat,
} from '@sendbird/uikit-react-native'

import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'

import GroupChannelInput from './GroupChannelInput'

const GroupChannelFragment = createGroupChannelFragment({
  Input: GroupChannelInput,
})

const GroupChannelScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannel>()

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, params.channelUrl)
  if (!channel) {
    return <></>
  }

  return (
    <>
      <GroupChannelFragment
        channel={channel}
        onPressMediaMessage={(fileMessage, deleteMessage): void => {
          // Navigate to media viewer
          navigation.navigate(Routes.FileViewer, {
            serializedFileMessage: fileMessage.serialize(),
            deleteMessage,
          })
        }}
        onChannelDeleted={(): void => {
          // Should leave channel, navigate to channel list
          navigation.navigate(Routes.GroupChannelList)
        }}
        onPressHeaderLeft={(): void => {
          // Navigate back
          navigation.goBack()
        }}
        onPressHeaderRight={(): void => {
          // Navigate to group channel settings
          navigation.push(Routes.GroupChannelSettings, params)
        }}
      />
    </>
  )
}

export default GroupChannelScreen
