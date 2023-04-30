import React, { ReactElement, useEffect, useState } from 'react'
import { SvgUri, SvgWithCss } from 'react-native-svg'
import base64 from 'react-native-base64'

import { MediaRendererProps } from '../molecules/MediaRenderer'
import FallbackMediaRenderer from './FallbackMediaRenderer'
import { UseResolvedMediaTypeReturn } from 'hooks/complex/useResolvedMediaType'

import { parseString } from 'react-native-xml2js'
import { recordError } from 'libs/logger'

const SvgRenderer = ({
  alt,
  style,
  width,
  height,
  mediaType,
  onError,
}: MediaRendererProps & {
  mediaType: UseResolvedMediaTypeReturn
  onError?: (error) => void
}): ReactElement => {
  const [xml, setXml] = useState<string | undefined>()

  useEffect(() => {
    let decoded: string | undefined
    if (mediaType.mimeType === 'data:image/svg+xml;base64') {
      decoded = base64.decode(
        mediaType.url?.replace('data:image/svg+xml;base64,', '') || ''
      )
    } else if (mediaType.mimeType === 'data:image/svg+xml') {
      decoded = mediaType.url?.replace('data:image/svg+xml,', '')
    }

    if (decoded) {
      parseString(decoded, (err, result) => {
        if (err || !result) {
          recordError(err)
          onError?.(err)
        } else {
          setXml(
            decoded
              ?.replace(/(\d+)%(\d+)/g, '$1%')
              ?.replace(/transform:translate.*\(.*\)/g, '')
          )
        }
      })
    }
  }, [mediaType])

  if (!mediaType.url || !xml) {
    return (
      <FallbackMediaRenderer
        width={width}
        height={height}
        style={style}
        src={mediaType.url}
        alt={alt}
      />
    )
  } else if (
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
