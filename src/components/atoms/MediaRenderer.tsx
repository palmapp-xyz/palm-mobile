import React, { ReactElement } from 'react'
import { StyleProp, FlexStyle, Image, ImageStyle } from 'react-native'

import { useResolvedMediaType } from 'hooks/complex/useResolvedMediaType'
import { shouldRenderAudioTag, shouldRenderVideoTag } from 'libs/media'
import IframePlayer from '../molecules/IframeRenderer'
import SvgRenderer from '../molecules/SvgRenderer'
import { isValidHttpUrl } from 'libs/utils'
import FallbackMediaRenderer from '../molecules/FallbackMediaRenderer'
import VideoRenderer from '../molecules/VideoRenderer'

export interface SharedMediaProps {
  style?: StyleProp<ImageStyle>
  width?: FlexStyle['width']
  height?: FlexStyle['height']
}

/**
 *
 * The props for the {@link MediaRenderer} component.
 * @public
 */
export interface MediaRendererProps extends SharedMediaProps {
  /**
   * The media source uri.
   */
  src?: string | null
  /**
   * The alt text for the media.
   */
  alt?: string
}

/**
 * This component can be used to render any media type, including image, audio, video, and html files.
 * Its convenient for rendering NFT media files, as these can be a variety of different types.
 * The component falls back to a external link if the media type is not supported.
 *
 * Props: {@link MediaRendererProps}
 *
 * @example
 * We can take a video file hosted on IPFS and render it using this component as follows
 * ```jsx
 * const Component = () => {
 *   return <MediaRenderer
 *     src='ipfs://Qmb9ZV5yznE4C4YvyJe8DVFv1LSVkebdekY6HjLVaKmHZi'
 *     alt='A mp4 video'
 *   />
 * }
 * ```
 *
 * You can try switching out the `src` prop to different types of URLs and media types to explore the possibilities.
 */
const MediaRenderer = ({
  src,
  alt,
  style,
  width,
  height,
}: MediaRendererProps): ReactElement => {
  const videoOrImageSrc = useResolvedMediaType(src ?? undefined)
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

  return (
    <FallbackMediaRenderer
      width={width}
      height={height}
      style={style}
      src={videoOrImageSrc.url}
      alt={alt}
    />
  )
}

export default MediaRenderer
