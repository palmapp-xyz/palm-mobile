import {
  UseResolvedMediaTypeReturn,
} from 'palm-react/hooks/independent/useResolvedMediaType'
import React, { ReactElement, useEffect, useState } from 'react'
import base64 from 'react-native-base64'

import { MediaRendererProps } from '../molecules/MediaRenderer'
import SvgImage from './SvgImage'

const SvgRenderer = ({
  alt,
  style,
  width,
  height,
  mediaType,
  onError,
  onLoadEnd,
}: MediaRendererProps & {
  mediaType: UseResolvedMediaTypeReturn
  onError?: (error) => void
  onLoadEnd?: () => void
}): ReactElement => {
  const [xml, setXml] = useState<string | undefined>()

  useEffect(() => {
    let decoded: string | undefined
    if (false /*mediaType.mimeType === 'data:image/svg+xml;base64'*/) {
      decoded = base64.decode(
        mediaType.url?.replace('data:image/svg+xml;base64,', '') || ''
      )
      setXml(`data:image/svg+xml,${decoded}`)
    } else {
      setXml(mediaType.url)
    }
  }, [mediaType])

  return (
    <SvgImage
      key={alt}
      style={[{ width, height }, style]}
      source={{ uri: xml }}
      onError={onError}
      onLoadEnd={onLoadEnd}
    />
  )
}

export default SvgRenderer
