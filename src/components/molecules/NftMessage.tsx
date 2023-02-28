import FileMessage, {
  FileMessageProps,
} from '@sendbird/uikit-react-native/src/components/MessageRenderer/FileMessage'
import { MediaRenderer } from './MediaRenderer'

import React, { ReactElement } from 'react'
import { Text, View } from 'react-native'

import {
  createStyleSheet,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation'
const NftMessage = (props: FileMessageProps): ReactElement => {
  const { colors } = useUIKitTheme()
  const { message, children, variant } = props
  if (!message.customType) {
    return <FileMessage {...props} />
  }

  return (
    <View
      style={[
        styles.bubbleContainer,
        {
          backgroundColor: colors.ui.message[variant].enabled.background,
        },
      ]}>
      <View
        style={[
          styles.image,
          {
            backgroundColor: colors.onBackground04,
          },
        ]}>
        <Text
          style={{ color: colors.secondary, fontSize: 16, marginBottom: 12 }}>
          {message.customType}
        </Text>
        <MediaRenderer
          key={message.messageId}
          src={message.data}
          width={180}
          height={180}
          style={{ margin: 'auto' }}
        />
      </View>
      {children}
    </View>
  )
}

const styles = createStyleSheet({
  bubbleContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: 240,
    maxWidth: 240,
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hide: {
    display: 'none',
  },
})

export default React.memo(NftMessage)
