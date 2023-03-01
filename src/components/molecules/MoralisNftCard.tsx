import React, { ReactElement } from 'react'
import { FlexStyle, Text, useWindowDimensions, View } from 'react-native'

import { Moralis, QueryKeyEnum } from 'types'
import useReactQuery from 'hooks/complex/useReactQuery'
import { fetchNftImage } from 'libs/fetchTokenUri'
import { MediaRenderer } from './MediaRenderer'
import ErrorBoundary from 'components/atoms/ErrorBoundary'
import FallbackMediaRenderer from './FallbackMediaRenderer'

const MoralisNftCard = ({
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

  const rowGap = 5
  const dim = windowWidth / (isLandscape ? 4 : 2) - rowGap * 7

  const { data: uri } = useReactQuery(
    [QueryKeyEnum.MORALIS_NFT_IMAGE, item.token_address, item.token_id],
    () => fetchNftImage({ metadata: item.metadata, tokenUri: item.token_uri })
  )

  const props = {
    src: typeof uri === 'string' ? uri : `${uri}`,
    alt: `${item.name}:${item.token_id}`,
    width: width || dim,
    height: height || dim,
    style: { marginBottom: 10 },
    hideAlt,
  }

  const fallback = (
    <View>
      <FallbackMediaRenderer {...props} />
      <Text>{`ID : ${item.token_id}`}</Text>
      <Text>{item.name}</Text>
    </View>
  )

  return (
    <View style={{ rowGap }}>
      <ErrorBoundary fallback={fallback}>
        <MediaRenderer {...props} />
        <Text>{`ID : ${item.token_id}`}</Text>
        <Text>{item.name}</Text>
      </ErrorBoundary>
    </View>
  )
}

export default MoralisNftCard
