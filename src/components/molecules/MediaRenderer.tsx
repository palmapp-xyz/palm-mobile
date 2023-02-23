import React, { ReactElement } from 'react'
import {
  StyleProp,
  FlexStyle,
  View,
  StyleSheet,
  Linking,
  Image,
  ViewStyle,
} from 'react-native'
import Svg, { SvgUri, Image as SvgImage } from 'react-native-svg'
import Video from 'react-native-video'
import { WebView } from 'react-native-webview'
import styled from 'styled-components/native'
import { Icons } from 'components'
import { useResolvedMediaType } from 'hooks/complex/useResolvedMediaType'
import { shouldRenderAudioTag, shouldRenderVideoTag } from 'libs/media'

export interface SharedMediaProps {
  style?: StyleProp<ViewStyle>
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

const styles = StyleSheet.create({
  video: {
    height: '100%',
    width: '100%',
    zIndex: 1,
    opacity: 1,
  },
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    color: 'rgb(138, 147, 155)',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
})

const VideoPlayer = ({
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
        style={styles.video}
        audioOnly={audioOnly}
      />
    </View>
  )
}

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

const StyledText = styled.Text`
  textdecoration: 'underline';
  color: 'rgb(138, 147, 155)';
`

const LinkPlayer = ({
  src,
  alt,
  width,
  height,
  style,
}: MediaRendererProps): ReactElement => {
  return (
    <View style={[{ position: 'relative', width, height }, style]}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Icons.CarbonDocumentUnknown width={150} height={150} />
          <StyledText
            onPress={async (): Promise<void> => {
              const canOpen = !!src && (await Linking.canOpenURL(src))
              if (canOpen) {
                Linking.openURL(src)
              }
            }}>
            {alt || 'File'}
          </StyledText>
        </View>
      </View>
    </View>
  )
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
export const MediaRenderer = ({
  src,
  alt,
  style,
  width,
  height,
}: MediaRendererProps): ReactElement => {
  const videoOrImageSrc = useResolvedMediaType(src ?? undefined)
  if (!videoOrImageSrc.mimeType) {
    return videoOrImageSrc.url?.includes('://') ? (
      <Image
        alt={alt}
        style={{ width, height }}
        source={{ uri: videoOrImageSrc.url }}
      />
    ) : (
      <Icons.CarbonDocumentUnknown width={150} height={150} />
    )
  } else if (videoOrImageSrc.url?.startsWith('data:image/svg+xml')) {
    return (
      <Svg width={width} height={height} style={style}>
        <SvgImage
          xlinkHref={videoOrImageSrc.url}
          x={0}
          y={0}
          height={300}
          width={300}
        />
      </Svg>
    )
  } else if (videoOrImageSrc.mimeType === 'image/svg+xml') {
    return (
      <SvgUri width={width} height={height} uri={videoOrImageSrc.url || null} />
    )
  } else if (videoOrImageSrc.mimeType === 'text/html') {
    return <IframePlayer style={style} src={videoOrImageSrc.url} />
  } else if (shouldRenderVideoTag(videoOrImageSrc.mimeType)) {
    return (
      <VideoPlayer
        style={style}
        width={width}
        height={height}
        src={videoOrImageSrc.url}
      />
    )
  } else if (shouldRenderAudioTag(videoOrImageSrc.mimeType)) {
    return (
      <VideoPlayer
        audioOnly={true}
        style={style}
        width={width}
        height={height}
        src={videoOrImageSrc.url}
      />
    )
  } else if (videoOrImageSrc.mimeType.startsWith('image/')) {
    return (
      <Image
        alt={alt}
        style={{ width, height }}
        source={{ uri: videoOrImageSrc.url }}
      />
    )
  }
  return <LinkPlayer style={style} src={videoOrImageSrc.url} alt={alt} />
}
