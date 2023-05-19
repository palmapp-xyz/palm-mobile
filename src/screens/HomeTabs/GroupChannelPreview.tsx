import { FormImage, FormText, Row } from 'components'
import React, { ReactElement, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { BaseMessage, MessageListParams } from '@sendbird/chat/message'
import { SendbirdGroupChannel, useAsyncEffect } from '@sendbird/uikit-utils'

const GroupChannelPreview = ({
  channel,
}: {
  channel: SendbirdGroupChannel
  onLongPressChannel: () => void
}): ReactElement | null => {
  const [messages, setMessages] = useState<BaseMessage[]>([])

  useAsyncEffect(async () => {
    const currentTimestamp = new Date().getTime()
    const messageListParams: MessageListParams = {
      prevResultSize: 1,
      nextResultSize: 0,
      reverse: true,
    }
    const msgs: BaseMessage[] = await channel.getMessagesByTimestamp(
      currentTimestamp,
      messageListParams
    )
    setMessages(msgs)
  }, [])

  if (messages.length === 0) {
    return null
  }

  const message: BaseMessage = messages[0]

  return (
    <Row style={styles.container}>
      <FormImage source={{ uri: channel.coverUrl }} size={56} />
      <View>
        <FormText fontType="B.16">{channel.name}</FormText>
        message. <FormText fontType="R.14">{message.createdAt}</FormText>
      </View>
    </Row>
  )
}

export default GroupChannelPreview

const styles = StyleSheet.create({
  container: { flex: 1 },
})
