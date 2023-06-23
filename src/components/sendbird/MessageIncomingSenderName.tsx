import React, { ReactElement } from 'react'
import { View } from 'react-native'

import { useLocalization } from '@sendbird/uikit-react-native'
import {
  createStyleSheet,
  Text,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation'

import type { SendbirdMessage } from '@sendbird/uikit-utils'

type Props = {
  message: SendbirdMessage
  grouping: boolean
}
const MessageIncomingSenderName = ({
  message,
  grouping,
}: Props): ReactElement | null => {
  const { colors } = useUIKitTheme()
  const { STRINGS } = useLocalization()
  if (grouping) {
    return null
  }

  return (
    <View style={styles.sender}>
      {(message.isFileMessage() || message.isUserMessage()) && (
        <Text
          caption1
          color={colors.ui.groupChannelMessage.incoming.enabled.textSenderName}
          numberOfLines={1}
        >
          {message.sender?.nickname || STRINGS.LABELS.USER_NO_NAME}
        </Text>
      )}
    </View>
  )
}

const styles = createStyleSheet({
  sender: {
    marginLeft: 4,
    marginBottom: 8,
  },
})

export default MessageIncomingSenderName