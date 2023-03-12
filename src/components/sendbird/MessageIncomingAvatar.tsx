import React, { ReactElement } from 'react'
import { TouchableOpacity, View } from 'react-native'

import {
  Avatar,
  createStyleSheet,
} from '@sendbird/uikit-react-native-foundation'
import type { SendbirdMessage } from '@sendbird/uikit-utils'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import { ContractAddr } from 'types'

type Props = {
  message: SendbirdMessage
  grouping: boolean
}
const MessageIncomingAvatar = ({ message, grouping }: Props): ReactElement => {
  const { navigation } = useAppNavigation()
  if (grouping) {
    return <View style={styles.avatar} />
  }
  return (
    <View style={styles.avatar}>
      {(message.isFileMessage() || message.isUserMessage()) && (
        <TouchableOpacity
          onPress={(): void => {
            const sender = message.sender
            navigation.navigate(Routes.UserProfile, {
              address: sender.userId as ContractAddr,
            })
          }}>
          <Avatar size={26} uri={message.sender?.profileUrl} />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = createStyleSheet({
  avatar: {
    width: 26,
    marginRight: 12,
  },
})

export default MessageIncomingAvatar
