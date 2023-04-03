import React, { ReactElement, useState } from 'react'
import { View } from 'react-native'
import Video from 'react-native-video'
import { useAsyncEffect } from '@sendbird/uikit-utils'
import { MediaRendererProps } from '../molecules/MediaRenderer'
import { usePlatformService } from '@sendbird/uikit-react-native'
import SBUUtils from '@sendbird/uikit-react-native/src/libs/SBUUtils'

const VideoRenderer = ({
  src,
  style,
  width,
  height,
  audioOnly,
}: MediaRendererProps & { audioOnly?: boolean }): ReactElement => {
  const [thumbnail, setThumbnail] = useState('')
  const { mediaService } = usePlatformService()

  useAsyncEffect(async () => {
    if (src) {
      await SBUUtils.safeRun(async () => {
        const result = await mediaService.getVideoThumbnail({
          url: src,
          timeMills: 1000,
        })
        setThumbnail(result?.path || '')
      })
    }
  }, [src])

  return (
    <View style={[{ position: 'relative', width, height }, style]}>
      <Video
        posterResizeMode={'contain'}
        poster={thumbnail}
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
