import Card from 'components/atoms/Card'
import { shouldRenderAudioTag, shouldRenderVideoTag } from 'core/libs/media'
import { useResolvedMediaType } from 'hooks/complex/useResolvedMediaType'
import React, { ReactElement, useCallback, useState } from 'react'
import { FlexStyle, StyleProp } from 'react-native'
import FastImage, {
  ImageStyle as RNFastImageStyle,
} from 'react-native-fast-image'
import * as Progress from 'react-native-progress'
import { isValidHttpUrl } from 'reactnative/utils'

import FallbackMediaRenderer from '../atoms/FallbackMediaRenderer'
import IframePlayer from '../atoms/IframeRenderer'
import SvgRenderer from '../atoms/SvgRenderer'
import VideoRenderer from '../atoms/VideoRenderer'

/**
 *
 * The props for the {@link MediaRenderer} component.
 * @public
 */
export interface MediaRendererProps {
  style?: StyleProp<RNFastImageStyle>
  width?: FlexStyle['width']
  height?: FlexStyle['height']
  /**
   * The media source uri.
   */
  src?: string | null
  /**
   * The alt text for the media.
   */
  alt?: string

  loading?: boolean

  metadata?: string | null

  onError?: () => void
}

const MediaRenderer = ({
  src,
  alt,
  style,
  width = '100%',
  height = '100%',
  loading,
  onError: onErrorCallback,
}: MediaRendererProps): ReactElement => {
  const [hasError, setError] = useState(false)
  const onError = useCallback(() => {
    setError(true)
    onErrorCallback?.()
  }, [src])

  const widthNum = typeof width === 'number' ? width : 0
  const heightNum = typeof height === 'number' ? height : 0
  let dim: number | undefined = Math.max(widthNum, heightNum)
  dim = dim > 0 ? dim : undefined

  const containerStyle: StyleProp<RNFastImageStyle> = [
    {
      width,
      height,
      maxWidth: dim,
      maxHeight: dim,
    },
    style,
  ]

  const videoOrImageSrc = useResolvedMediaType(
    src && typeof src === 'string' ? src.trim() : ''
  )

  if (videoOrImageSrc.isLoading || loading) {
    return (
      <Card center={true} style={containerStyle}>
        <Progress.Pie size={20} indeterminate={true} />
      </Card>
    )
  }

  const fallback: ReactElement = (
    <FallbackMediaRenderer
      width={width}
      height={height}
      style={containerStyle}
      src={videoOrImageSrc.url}
      alt={alt}
    />
  )

  if (hasError) {
    return fallback
  }

  if (
    videoOrImageSrc.mimeType?.includes('svg') ||
    videoOrImageSrc.mimeType?.includes('xml')
  ) {
    return (
      <SvgRenderer
        alt={alt}
        style={containerStyle}
        width={width}
        height={height}
        mediaType={videoOrImageSrc}
        onError={onError}
      />
    )
  } else if (videoOrImageSrc.mimeType === 'text/html') {
    return <IframePlayer style={containerStyle} src={videoOrImageSrc.url} />
  } else if (shouldRenderVideoTag(videoOrImageSrc.mimeType)) {
    return (
      <VideoRenderer
        style={containerStyle}
        width={width}
        height={height}
        src={videoOrImageSrc.url}
        onError={onError}
      />
    )
  } else if (shouldRenderAudioTag(videoOrImageSrc.mimeType)) {
    return (
      <VideoRenderer
        audioOnly={true}
        style={containerStyle}
        width={width}
        height={height}
        src={videoOrImageSrc.url}
        onError={onError}
      />
    )
  } else if (
    videoOrImageSrc.mimeType?.startsWith('image/') ||
    isValidHttpUrl(videoOrImageSrc.url)
  ) {
    return (
      <FastImage
        style={containerStyle}
        source={{
          uri: videoOrImageSrc.url,
        }}
        onError={onError}
      />
    )
  }

  return fallback
}

export default MediaRenderer
