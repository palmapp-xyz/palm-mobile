import React, { ReactElement } from 'react'

import { ContractAddr, NftType, SupportedNetworkEnum } from 'types'
import { FlexStyle, ImageStyle, StyleProp } from 'react-native'
import useNftImage from 'hooks/independent/useNftImage'
import MediaRenderer from './MediaRenderer'
import { MediaRendererProps } from 'components/molecules/MediaRenderer'

const NftRenderer = ({
  nftContract,
  tokenId,
  type,
  chain,
  width,
  height,
  style,
}: {
  nftContract: ContractAddr
  tokenId: string
  type: NftType
  chain: SupportedNetworkEnum
  width?: FlexStyle['width']
  height?: FlexStyle['height']
  style?: StyleProp<ImageStyle>
}): ReactElement => {
  const { loading, uri } = useNftImage({
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
    style,
  }

  return <MediaRenderer {...props} />
}

export default NftRenderer
