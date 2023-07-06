import { Routes } from 'palm-core/libs/navigation'
import { SbUserMetadata } from 'palm-core/types'
import MediaRenderer from 'palm-react-native-ui-kit/components/molecules/MediaRenderer'
import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import React, { ReactElement } from 'react'
import { TouchableOpacity, View } from 'react-native'

import { createStyleSheet } from '@sendbird/uikit-react-native-foundation'

import Avatar from './Avatar'

import type { SendbirdMessage } from '@sendbird/uikit-utils'
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
            navigation.push(Routes.UserProfile, {
              address: (sender.metaData as SbUserMetadata).address,
              profileId: sender.userId,
            })
          }}
        >
          {message.sender?.profileUrl ? (
            <MediaRenderer
              src={message.sender.profileUrl}
              width={36}
              height={36}
              style={{ borderRadius: 50 }}
            />
          ) : (
            <Avatar size={36} uri={message.sender?.profileUrl} />
          )}
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = createStyleSheet({
  avatar: {
    width: 36,
    marginRight: 12,
  },
})

export default MessageIncomingAvatar
