import React, { ReactElement, useCallback, useState } from 'react'
import { SvgUri, SvgWithCss } from 'react-native-svg'
import base64 from 'react-native-base64'

import { MediaRendererProps } from '../molecules/MediaRenderer'
import FallbackMediaRenderer from './FallbackMediaRenderer'
import { UseResolvedMediaTypeReturn } from 'hooks/complex/useResolvedMediaType'

const SvgRenderer = ({
  alt,
  style,
  width,
  height,
  mediaType,
}: MediaRendererProps & {
  mediaType: UseResolvedMediaTypeReturn
}): ReactElement => {
  const [hasError, setError] = useState(false)
  const onError = useCallback(() => {
    setError(true)
  }, [])

  if (!mediaType.url || hasError) {
    return (
      <FallbackMediaRenderer
        width={width}
        height={height}
        style={style}
        src={mediaType.url}
        alt={alt}
      />
    )
  }

  if (
    !mediaType.mimeType?.startsWith('data') &&
    mediaType.mimeType?.includes('image/svg+xml')
  ) {
    return (
      <SvgUri
        width={width}
        height={height}
        style={style}
        uri={mediaType.url || null}
      />
    )
  }

  let xml
  if (mediaType.mimeType === 'data:image/svg+xml;base64') {
    xml = base64.decode(
      mediaType.url?.replace('data:image/svg+xml;base64,', '') || ''
    )
  } else if (mediaType.mimeType === 'data:image/svg+xml') {
    xml = mediaType.url?.replace('data:image/svg+xml,', '')
  }

  // https://github.com/software-mansion/react-native-svg/issues/1740
  if (!xml || xml?.includes('transform:translate')) {
    return (
      <FallbackMediaRenderer
        width={width}
        height={height}
        style={style}
        src={mediaType.url}
        alt={alt}
      />
    )
  }

  return (
    <SvgWithCss
      width={width}
      height={height}
      onError={onError}
      style={style}
      xml={xml}
    />
  )
}

export default SvgRenderer
