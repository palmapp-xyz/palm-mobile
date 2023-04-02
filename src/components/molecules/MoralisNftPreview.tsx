import React, { ReactElement } from 'react'
import { FlexStyle, useWindowDimensions, View } from 'react-native'

import { Moralis } from 'types'
import MediaRenderer from '../atoms/MediaRenderer'
import ErrorBoundary from '../atoms/ErrorBoundary'
import FallbackMediaRenderer from './FallbackMediaRenderer'

const MoralisNftPreview = ({
  item,
  resolution,
  width,
  height,
  hideAlt,
}: {
  item: Moralis.NftItem
  resolution: 'low' | 'medium' | 'high'
  width?: FlexStyle['width']
  height?: FlexStyle['height']
  hideAlt?: boolean
}): ReactElement => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()
  const isLandscape = windowWidth > windowHeight

  const dim = windowWidth / (isLandscape ? 4 : 2)

  const preview: Moralis.MediaPreview | undefined =
    item.media?.media_collection?.[resolution || 'medium']
  const props = {
    src: preview ?? require('../assets/no_img.png'),
    alt: `${item.name}:${item.token_id}`,
    width: width || dim,
    height: height || dim,
    hideAlt,
    metadata: item.metadata,
  }

  console.log('!!!!!!', preview)

  const fallback = <FallbackMediaRenderer {...props} />

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ErrorBoundary fallback={fallback}>
        <MediaRenderer {...props} />
      </ErrorBoundary>
    </View>
  )
}

export default MoralisNftPreview
