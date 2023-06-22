import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'

import {
  createStyleSheet,
  Text,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation'

import { MessageRendererInterface } from '../MessageRenderer'

import type { SendbirdAdminMessage } from '@sendbird/uikit-utils'
export type AdminMessageProps = MessageRendererInterface<SendbirdAdminMessage>
const AdminMessage = ({
  message,
  nextMessage,
}: AdminMessageProps): ReactElement => {
  const { colors } = useUIKitTheme()

  const isNextAdmin = nextMessage?.isAdminMessage()
  return (
    <View
      style={StyleSheet.flatten([
        styles.container,
        isNextAdmin ? styles.nextAdminType : styles.next,
      ])}
    >
      <Text caption2 color={colors.onBackground02} style={styles.text}>
        {message.message}
      </Text>
    </View>
  )
}

const styles = createStyleSheet({
  container: {
    width: 300,
    alignSelf: 'center',
    alignItems: 'center',
  },
  nextAdminType: {
    marginBottom: 8,
  },
  next: {
    marginBottom: 16,
  },
  text: {
    textAlign: 'center',
  },
})

export default AdminMessage
