import React, { ReactElement } from 'react'

import ErrorBoundary from 'components/atoms/ErrorBoundary'
import FallbackMediaRenderer from './FallbackMediaRenderer'
import MediaRenderer, { MediaRendererProps } from '../atoms/MediaRenderer'
import { ImageStyle, StyleProp } from 'react-native'

const NftMediaRenderer = ({
  containerStyle,
  ...props
}: MediaRendererProps & {
  containerStyle?: StyleProp<ImageStyle>
}): ReactElement => {
  if (typeof props.src !== 'string') {
    props.src = String(props.src)
  }
  if (!props.width) {
    props.width = '100%'
  }
  if (!props.height) {
    props.height = '100%'
  }

  const fallback = <FallbackMediaRenderer {...props} />

  return (
    <ErrorBoundary fallback={fallback} style={containerStyle}>
      <MediaRenderer {...props} />
    </ErrorBoundary>
  )
}

export default NftMediaRenderer
