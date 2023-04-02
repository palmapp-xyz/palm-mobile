import React, { ReactElement } from 'react'
import { FlexStyle, useWindowDimensions, View } from 'react-native'

import { Moralis, SupportedNetworkEnum } from 'types'
import MediaRenderer from '../atoms/MediaRenderer'
import ErrorBoundary from '../atoms/ErrorBoundary'
import FallbackMediaRenderer from './FallbackMediaRenderer'
import useNftImage from 'hooks/independent/useNftImage'
import { chainIdToSupportedNetworkEnum } from 'libs/utils'

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

  const chain: SupportedNetworkEnum =
    chainIdToSupportedNetworkEnum(item.chainId || '0x1') ||
    SupportedNetworkEnum.ETHEREUM

  const { loading, uri, metadata } = useNftImage({
    nftContract: item.token_address,
    tokenId: item.token_id,
    type: item.contract_type,
    metadata: item.metadata,
    chain,
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
