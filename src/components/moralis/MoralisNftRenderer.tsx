import MediaRenderer from 'components/molecules/MediaRenderer'
import NftRenderer from 'components/molecules/NftRenderer'
import { UTIL } from 'core/libs'
import { Moralis, SupportedNetworkEnum } from 'core/types'
import React, { ReactElement } from 'react'
import { FlexStyle, StyleProp } from 'react-native'
import { ImageStyle } from 'react-native-fast-image'

const MoralisNftRenderer = ({
  item,
  width,
  height,
  style,
  resolution = 'medium',
  hideChain,
}: {
  item: Moralis.NftItem
  width?: FlexStyle['width']
  height?: FlexStyle['height']
  style?: StyleProp<ImageStyle>
  resolution?: 'low' | 'medium' | 'high'
  hideChain?: boolean
}): ReactElement => {
  const chain: SupportedNetworkEnum =
    UTIL.chainIdToSupportedNetworkEnum(item.chainId || '0x1') ||
    SupportedNetworkEnum.ETHEREUM

  const previewUri =
    item.media?.media_collection?.[resolution]?.url ||
    item?.media?.media_collection?.medium?.url ||
    item?.media?.media_collection?.high?.url ||
    item?.media?.original_media_url

  return previewUri ? (
    <MediaRenderer
      src={previewUri}
      alt={`${item.name}:${item.token_id}`}
      width={width}
      height={height}
      style={style}
    />
  ) : (
    <NftRenderer
      nftContract={item.token_address}
      tokenId={item.token_id}
      type={item.contract_type}
      metadata={item.metadata}
      chain={chain}
      width={width}
      height={height}
      hideChain={hideChain || !item.chainId}
      style={style}
    />
  )
}

export default MoralisNftRenderer
