import React, { ReactElement } from 'react'
import { FlexStyle, useWindowDimensions, View } from 'react-native'

import { Moralis, QueryKeyEnum } from 'types'
import useReactQuery from 'hooks/complex/useReactQuery'
import { fetchNftImage } from 'libs/fetchTokenUri'
import MediaRenderer from '../atoms/MediaRenderer'
import ErrorBoundary from '../atoms/ErrorBoundary'
import FallbackMediaRenderer from './FallbackMediaRenderer'

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

  const { data: uri } = useReactQuery(
    [QueryKeyEnum.MORALIS_NFT_IMAGE, item.token_address, item.token_id],
    () => fetchNftImage({ metadata: item.metadata, tokenUri: item.token_uri })
  )

  const props = {
    src: typeof uri === 'string' ? uri : `${uri}`,
    alt: `${item.name}:${item.token_id}`,
    width: width || dim,
    height: height || dim,
    hideAlt,
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
