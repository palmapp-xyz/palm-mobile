import React, { ReactElement } from 'react'

import { ContractAddr, NftType, SupportedNetworkEnum } from 'types'
import { FlexStyle, ImageStyle, StyleProp } from 'react-native'
import useNftImage from 'hooks/independent/useNftImage'
import MediaRenderer from './MediaRenderer'
import { MediaRendererProps } from 'components/molecules/MediaRenderer'
import { Maybe } from '@toruslabs/openlogin'
import ChainLogoWrapper from './ChainLogoWrapper'

export type NftRendererProp = {
  nftContract: ContractAddr
  tokenId: string
  type: NftType
  chain: SupportedNetworkEnum
  metadata?: Maybe<string>
  width?: FlexStyle['width']
  height?: FlexStyle['height']
  style?: StyleProp<ImageStyle>
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
