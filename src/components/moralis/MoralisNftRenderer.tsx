import React, { ReactElement, useMemo } from 'react'
import { FlexStyle, useWindowDimensions } from 'react-native'

import { Moralis, SupportedNetworkEnum } from 'types'
import MediaRenderer from '../molecules/MediaRenderer'
import useNftImage from 'hooks/independent/useNftImage'
import { chainIdToSupportedNetworkEnum } from 'libs/utils'

const MoralisNftRenderer = ({
  item,
  width,
  height,
}: {
  item: Moralis.NftItem
  width?: FlexStyle['width']
  height?: FlexStyle['height']
}): ReactElement => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()
  const isLandscape = windowWidth > windowHeight

  const dim = windowWidth / (isLandscape ? 4 : 2)

  const chain: SupportedNetworkEnum =
    chainIdToSupportedNetworkEnum(item.chainId || '0x1') ||
    SupportedNetworkEnum.ETHEREUM

  const { loading, uri } = useNftImage({
    nftContract: item.token_address,
    tokenId: item.token_id,
    type: item.contract_type,
    metadata: item.metadata,
    chain,
  })

  const src = useMemo(
    () =>
      item.media?.media_collection?.medium?.url ||
      (typeof uri === 'string' ? uri : `${uri}`),
    [uri]
  )

  return (
    <MediaRenderer
      src={src}
      alt={`${item.name}:${item.token_id}`}
      width={width || dim}
      height={height || dim}
      loading={loading}
    />
  )
}

export default MoralisNftRenderer
