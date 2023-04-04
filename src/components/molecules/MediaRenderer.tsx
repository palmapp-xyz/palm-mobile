import React, { ReactElement } from 'react'
import { StyleProp, FlexStyle, Image, ImageStyle, View } from 'react-native'
import * as Progress from 'react-native-progress'

import { useResolvedMediaType } from 'hooks/complex/useResolvedMediaType'
import { shouldRenderAudioTag, shouldRenderVideoTag } from 'libs/media'
import { isValidHttpUrl } from 'libs/utils'

import IframePlayer from '../atoms/IframeRenderer'
import SvgRenderer from '../atoms/SvgRenderer'
import FallbackMediaRenderer from '../atoms/FallbackMediaRenderer'
import VideoRenderer from '../atoms/VideoRenderer'

/**
 *
 * The props for the {@link MediaRenderer} component.
 * @public
 */
export interface MediaRendererProps {
  style?: StyleProp<ImageStyle>
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
}

const MediaRenderer = ({
  src,
  alt,
  style,
  width,
  height,
  loading,
}: MediaRendererProps): ReactElement => {
  const videoOrImageSrc = useResolvedMediaType(src ?? undefined)

  if (videoOrImageSrc.isLoading || loading) {
    return (
      <View
        style={{
          width,
          height,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Progress.Pie size={20} indeterminate={true} />
      </View>
    )
  }

  if (videoOrImageSrc.mimeType?.includes('svg')) {
    return (
      <SvgRenderer
        alt={alt}
        style={style}
        width={width}
        height={height}
        mediaType={videoOrImageSrc}
      />
    )
  } else if (videoOrImageSrc.mimeType === 'text/html') {
    return <IframePlayer style={style} src={videoOrImageSrc.url} />
  } else if (shouldRenderVideoTag(videoOrImageSrc.mimeType)) {
    return (
      <VideoRenderer
        style={style}
        width={width}
        height={height}
        src={videoOrImageSrc.url}
      />
    )
  } else if (shouldRenderAudioTag(videoOrImageSrc.mimeType)) {
    return (
      <VideoRenderer
        audioOnly={true}
        style={style}
        width={width}
        height={height}
        src={videoOrImageSrc.url}
      />
    )
  } else if (
    videoOrImageSrc.mimeType?.startsWith('image/') ||
    isValidHttpUrl(videoOrImageSrc.url)
  ) {
    return (
      <Image
        alt={alt}
        style={[{ width, height }, style]}
        source={{ uri: videoOrImageSrc.url }}
      />
    )
  }

  return <FallbackMediaRenderer width={width} height={height} style={style} />
}

export default MediaRenderer