import React, { ReactElement } from 'react'
import { View } from 'react-native'
import WebView from 'react-native-webview'
import { MediaRendererProps } from '../atoms/MediaRenderer'

const IframePlayer = ({
  src,
  width,
  height,
  style,
  ...restProps
}: MediaRendererProps): ReactElement => {
  return (
    <View
      style={[{ position: 'relative', width, height }, style]}
      {...restProps}>
      <WebView
        source={{ html: "<iFrame src='" + src + "' />" }}
        originWhitelist={['*']}
      />
    </View>
  )
}

export default IframePlayer
