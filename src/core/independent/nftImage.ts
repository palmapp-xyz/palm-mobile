import { Nft } from 'core/contract/nft'
import { fetchNftImage } from 'core/libs/fetchTokenUri'
import { ContractAddr, NftType, SupportedNetworkEnum } from 'core/types'

import { Maybe } from '@toruslabs/openlogin'

export type GetNftImageReturn = {
  uri?: string
  metadata?: Maybe<string>
}

export const getNftImage = async ({
  nftContract,
  tokenId,
  type,
  metadata,
  chain,
}: {
  nftContract: ContractAddr
  tokenId: string
  type: NftType
  metadata?: Maybe<string>
  chain: SupportedNetworkEnum
}): Promise<GetNftImageReturn> => {
  const nft = new Nft({ nftContract, chain })

  let tokenUri =
    type === NftType.ERC721
      ? await nft.tokenURI({ tokenId })
      : await nft.URI({ tokenId })
  tokenUri = tokenUri?.trim()

  const data = await fetchNftImage({
    nftContract,
    tokenId,
    metadata,
    tokenUri: tokenUri ?? '',
  })

  return {
    uri: data?.image,
    metadata: data?.metadata,
  }
}
