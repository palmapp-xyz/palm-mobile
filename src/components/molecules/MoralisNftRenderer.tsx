import React, { ReactElement } from 'react'
import { FlexStyle, useWindowDimensions, View } from 'react-native'

import { Moralis } from 'types'
import MediaRenderer from '../atoms/MediaRenderer'
import ErrorBoundary from '../atoms/ErrorBoundary'
import FallbackMediaRenderer from './FallbackMediaRenderer'
import useNftImage from 'hooks/independent/useNftImage'

const MoralisNftRenderer = ({
  item,
  width,
  height,
  hideAlt,
}: {
  item: Moralis.NftItem
  width?: FlexStyle['width']
  height?: FlexStyle['height']
  hideAlt?: boolean
}): ReactElement => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()
  const isLandscape = windowWidth > windowHeight

  const dim = windowWidth / (isLandscape ? 4 : 2)

  const { loading, uri, metadata } = useNftImage({
    nftContract: item.token_address,
    tokenId: item.token_id,
    metadata: item.metadata,
  })
  const props = {
    src: typeof uri === 'string' ? uri : `${uri}`,
    alt: `${item.name}:${item.token_id}`,
    width: width || dim,
    height: height || dim,
    hideAlt,
    loading,
    metadata,
  }

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

export default MoralisNftRenderer
