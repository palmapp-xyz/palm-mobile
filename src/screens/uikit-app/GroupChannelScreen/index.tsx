import React, { ReactElement } from 'react'
import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import { SendbirdMessage } from '@sendbird/uikit-utils'

import {
  createGroupChannelFragment,
  MessageRenderer,
  useSendbirdChat,
} from '@sendbird/uikit-react-native'

import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'

import GroupChannelInput from './GroupChannelInput'
import GroupChannelMessageList from './GroupChannelMessageList'
import { Text, View } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native'
import { GroupChannel } from '@sendbird/chat/groupChannel'

const GroupChannelFragment = createGroupChannelFragment({
  Input: GroupChannelInput,
  MessageList: GroupChannelMessageList,
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
        renderMessage={(props: {
          message: SendbirdMessage
          prevMessage?: SendbirdMessage | undefined
          nextMessage?: SendbirdMessage | undefined
          onPress?: (() => void) | undefined
          onLongPress?: (() => void) | undefined
          channel: GroupChannel
          currentUserId?: string | undefined
          enableMessageGrouping: boolean
        }): ReactElement | null => {
          if (props.message.customType) {
            return (
              <TouchableWithoutFeedback
                onPress={props.onPress}
                onLongPress={props.onLongPress}>
                <View>
                  <Text>{`Message: ${props.message.messageId} (${props.message.messageType})`}</Text>
                  <Text>{`Message custom type: ${props.message.customType}`}</Text>
                  <Text>{`Message is UserMsg? ${props.message.isUserMessage()}`}</Text>
                  <Text>{`Message is FileMsg? ${props.message.isFileMessage()}`}</Text>
                </View>
              </TouchableWithoutFeedback>
            )
          }
          return <MessageRenderer {...props} />
        }}
      />
    </>
  )
}

export default GroupChannelScreen
