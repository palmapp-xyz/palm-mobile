import React, { ReactElement } from 'react'

import { ContractAddr, NftType, SupportedNetworkEnum } from 'types'
import { FlexStyle, ImageStyle, StyleProp } from 'react-native'
import useNftImage from 'hooks/independent/useNftImage'
import NftMediaRenderer from './NftMediaRenderer'
import { MediaRendererProps } from 'components/atoms/MediaRenderer'

const NftRenderer = ({
  nftContract,
  tokenId,
  type,
  chain,
  width,
  height,
  style,
  containerStyle,
}: {
  nftContract: ContractAddr
  tokenId: string
  type: NftType
  chain: SupportedNetworkEnum
  width?: FlexStyle['width']
  height?: FlexStyle['height']
  style?: StyleProp<ImageStyle>
  containerStyle?: StyleProp<ImageStyle>
}): ReactElement => {
  const { loading, uri, metadata } = useNftImage({
    nftContract,
    tokenId,
    type,
    chain,
  })

  const props: MediaRendererProps = {
    src: uri,
    alt: `${nftContract}:${tokenId}`,
    width,
    height,
    loading,
    metadata,
    style,
  }

  return <NftMediaRenderer {...props} containerStyle={containerStyle} />
}

export default NftRenderer
