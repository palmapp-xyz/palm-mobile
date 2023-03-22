import React, { ReactElement } from 'react'

import { ContractAddr } from 'types'
import ErrorBoundary from 'components/atoms/ErrorBoundary'
import FallbackMediaRenderer from './FallbackMediaRenderer'
import MediaRenderer from '../atoms/MediaRenderer'
import { FlexStyle } from 'react-native'
import useNftImage from 'hooks/independent/useNftImage'

const NftRenderer = ({
  nftContract,
  tokenId,
  width,
  height,
}: {
  nftContract: ContractAddr
  tokenId: string
  width?: FlexStyle['width']
  height?: FlexStyle['height']
}): ReactElement => {
  const { loading, uri, metadata } = useNftImage({
    nftContract,
    tokenId,
  })

  const props = {
    src: typeof uri === 'string' ? uri : `${uri}`,
    alt: `${nftContract}:${tokenId}`,
    width: width || '100%',
    height: height || '100%',
    loading,
    metadata,
  }

  const fallback = <FallbackMediaRenderer {...props} />

  return (
    <ErrorBoundary fallback={fallback}>
      <MediaRenderer {...props} />
    </ErrorBoundary>
  )
}

export default NftRenderer
