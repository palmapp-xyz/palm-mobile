import { MediaRendererProps } from 'components/molecules/MediaRenderer'
import useNftImage from 'hooks/independent/useNftImage'
import React, { ReactElement } from 'react'
import { FlexStyle, StyleProp } from 'react-native'
import { ImageStyle as RNFastImageStyle } from 'react-native-fast-image'
import { ContractAddr, NftType, SupportedNetworkEnum } from 'types'

import { Maybe } from '@toruslabs/openlogin'

import ChainLogoWrapper from './ChainLogoWrapper'
import MediaRenderer from './MediaRenderer'

export type NftRendererProp = {
  nftContract: ContractAddr
  tokenId: string
  type: NftType
  chain: SupportedNetworkEnum
  metadata?: Maybe<string>
  width?: FlexStyle['width']
  height?: FlexStyle['height']
  style?: StyleProp<RNFastImageStyle>
}

const NftRenderer = ({
  nftContract,
  tokenId,
  type,
  chain,
  metadata,
  width,
  height,
  style,
}: NftRendererProp): ReactElement => {
  const {
    loading,
    uri,
    metadata: _metadata,
  } = useNftImage({
    nftContract,
    tokenId,
    type,
    chain,
    metadata,
  })

  const props: MediaRendererProps = {
    src: uri,
    alt: `${nftContract}:${tokenId}`,
    width,
    height,
    loading,
    style,
    metadata: _metadata,
  }

  return (
    <ChainLogoWrapper chain={chain}>
      <MediaRenderer {...props} />
    </ChainLogoWrapper>
  )
}

export default NftRenderer
