import React, { ReactElement } from 'react'
import { Linking, StyleSheet, Text, View } from 'react-native'

import Icons from 'components/atoms/Icons'

import { MediaRendererProps } from '../atoms/MediaRenderer'
import Card from 'components/atoms/Card'

const FallbackMediaRenderer = ({
  src,
  alt,
  width,
  height,
  style,
  hideAlt,
}: MediaRendererProps & {
  hideAlt?: boolean
}): ReactElement => {
  const dim =
    typeof width === 'number' ? width : typeof height === 'number' ? height : 50
  return (
    <Card center={true} style={[style, { padding: 0, width, height }]}>
      <Icons.CarbonDocumentUnknown width={dim / 2} height={dim / 2} />
      {!hideAlt && (
        <View style={styles.container}>
          <Text
            style={styles.text}
            numberOfLines={1}
            onPress={async (): Promise<void> => {
              const canOpen = !!src && (await Linking.canOpenURL(src))
              if (canOpen) {
                Linking.openURL(src)
              }
            }}>
            {alt || 'File'}
          </Text>
        </View>
      )}
    </Card>
  )
}

export default FallbackMediaRenderer

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { color: 'rgb(138, 147, 155)' },
})
