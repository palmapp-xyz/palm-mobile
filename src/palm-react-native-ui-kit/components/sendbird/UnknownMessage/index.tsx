import React, { ReactElement } from 'react'
import { View } from 'react-native'

import { useLocalization } from '@sendbird/uikit-react-native'
import {
  createStyleSheet,
  Text,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation'

import { MessageRendererInterface } from '../MessageRenderer'

export type UnknownMessageProps = MessageRendererInterface
const UnknownMessage = ({
  message,
  variant,
  pressed,
}: UnknownMessageProps): ReactElement => {
  const { STRINGS } = useLocalization()
  const { colors } = useUIKitTheme()
  const color =
    colors.ui.groupChannelMessage[variant][pressed ? 'pressed' : 'enabled']
  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      <Text body3 color={colors.onBackground01}>
        {STRINGS.GROUP_CHANNEL.MESSAGE_BUBBLE_UNKNOWN_TITLE(message)}
      </Text>
      <Text body3 color={colors.onBackground02}>
        {STRINGS.GROUP_CHANNEL.MESSAGE_BUBBLE_UNKNOWN_DESC(message)}
      </Text>
    </View>
  )
}

const styles = createStyleSheet({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
})

export default UnknownMessage
