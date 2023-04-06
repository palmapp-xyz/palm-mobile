import React, { ReactElement, useState } from 'react'
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
  onError,
}: MediaRendererProps & {
  audioOnly?: boolean
  onError?: (error) => void
}): ReactElement => {
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
    <Video
      posterResizeMode={'contain'}
      poster={thumbnail}
      source={{
        uri: src ?? undefined,
      }}
      repeat={true}
      muted={true}
      resizeMode={'contain'}
      audioOnly={audioOnly}
      style={[{ position: 'relative', width, height }, style]}
      onError={onError}
    />
  )
}

export default VideoRenderer
