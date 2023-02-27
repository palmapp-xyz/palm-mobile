import React, { ReactElement } from 'react'

import { ContractAddr, QueryKeyEnum } from 'types'
import useReactQuery from 'hooks/complex/useReactQuery'
import useNft from 'hooks/contract/useNft'
import { fetchNftImage } from 'libs/fetchTokenUri'
import ErrorBoundary from 'components/atoms/ErrorBoundary'
import FallbackMediaRenderer from './FallbackMediaRenderer'
import { MediaRenderer } from './MediaRenderer'
import { FlexStyle } from 'react-native'

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
  const { tokenURI } = useNft({ nftContract })

  const { data: uri = '' } = useReactQuery(
    [QueryKeyEnum.NFT_TOKEN_URI, nftContract, tokenId],
    async () => {
      const tokenUri = await tokenURI({ tokenId })
      if (tokenUri) {
        return fetchNftImage({ tokenUri })
      }
    }
  )

  const props = {
    src: typeof uri === 'string' ? uri : `${uri}`,
    alt: `${nftContract}:${tokenId}`,
    width: width || '100%',
    height: height || '100%',
  }

  const fallback = <FallbackMediaRenderer {...props} />

  return (
    <ErrorBoundary fallback={fallback}>
      <MediaRenderer {...props} />
    </ErrorBoundary>
  )
}

export default NftRenderer
