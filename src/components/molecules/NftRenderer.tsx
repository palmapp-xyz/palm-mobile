import React, { ReactElement } from 'react'
import { Image } from 'react-native'
import { SvgUri } from 'react-native-svg'

import { ContractAddr, QueryKeyEnum } from 'types'
import useReactQuery from 'hooks/complex/useReactQuery'
import useNft from 'hooks/contract/useNft'
import { nftUriFetcher } from 'libs/nft'

const NftRenderer = ({
  nftContract,
  tokenId,
}: {
  nftContract: ContractAddr
  tokenId: string
}): ReactElement => {
  const { tokenURI } = useNft({ nftContract })

  const { data: { uri, type } = { uri: '', type: '' } } = useReactQuery(
    [QueryKeyEnum.NFT_TOKEN_URI, nftContract, tokenId],
    async () => {
      const tokenUri = await tokenURI({ tokenId })

      if (tokenUri) {
        return nftUriFetcher(tokenUri)
      }
    }
  )

  return (
    <>
      {type.includes('image') &&
        (type.includes('svg') ? (
          <SvgUri width="100%" height="100%" uri={uri} />
        ) : (
          <Image source={{ uri }} style={{ width: '100%', height: '100%' }} />
        ))}
    </>
  )
}

export default NftRenderer
