import React, { ReactElement } from 'react'
import { View } from 'react-native'

import { useLocalization } from '@sendbird/uikit-react-native'
import { createStyleSheet } from '@sendbird/uikit-react-native-foundation'

import type { SendbirdMessage } from '@sendbird/uikit-utils'
import { COLOR } from 'palm-core/consts'
import FormText from '../atoms/FormText'

type Props = {
  message: SendbirdMessage
  grouping: boolean
}
const MessageIncomingSenderName = ({
  message,
  grouping,
}: Props): ReactElement | null => {
  const { STRINGS } = useLocalization()
  if (grouping) {
    return null
  }

  return (
    <View style={styles.sender}>
      {(message.isFileMessage() || message.isUserMessage()) && (
        <FormText numberOfLines={1} font="B" size={14} color={COLOR.black._500}>
          {message.sender?.nickname || STRINGS.LABELS.USER_NO_NAME}
        </FormText>
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
