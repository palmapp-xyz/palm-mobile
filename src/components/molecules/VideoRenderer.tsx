import React, { ReactElement } from 'react'
import { View } from 'react-native'

import Video from 'react-native-video'
import { MediaRendererProps } from './MediaRenderer'

const VideoRenderer = ({
  src,
  style,
  width,
  height,
  audioOnly,
}: MediaRendererProps & { audioOnly?: boolean }): ReactElement => {
  return (
    <View style={[{ position: 'relative', width, height }, style]}>
      <Video
        source={{ uri: src ?? undefined }}
        repeat={true}
        muted={true}
        resizeMode={'contain'}
        audioOnly={audioOnly}
      />
    </View>
  )
}

export default VideoRenderer
