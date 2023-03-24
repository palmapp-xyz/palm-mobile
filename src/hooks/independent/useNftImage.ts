import { Maybe } from '@toruslabs/openlogin'
import { UTIL } from 'consts'
import useReactQuery from 'hooks/complex/useReactQuery'
import useNft from 'hooks/contract/useNft'
import { fetchNftImage } from 'libs/fetchTokenUri'
import { ContractAddr, QueryKeyEnum, SupportedNetworkEnum } from 'types'

export type UseNftImageReturn = {
  loading: boolean
  uri?: string
  metadata?: Maybe<string>
}

const useNftImage = ({
  nftContract,
  tokenId,
  metadata,
  chain,
}: {
  nftContract: ContractAddr
  tokenId: string
  metadata?: Maybe<string>
  chain: SupportedNetworkEnum
}): UseNftImageReturn => {
  const { tokenURI } = useNft({ nftContract, chain })
  const { data: tokenUri = '' } = useReactQuery(
    [QueryKeyEnum.NFT_TOKEN_URI, nftContract, tokenId, chain],
    async () => {
      const uri = await tokenURI({ tokenId })
      if (uri && UTIL.isURL(uri.trim())) {
        return uri.trim()
      }
    }
  )

  const { data, isLoading } = useReactQuery(
    [QueryKeyEnum.MORALIS_NFT_IMAGE, tokenUri, metadata],
    () => fetchNftImage({ metadata, tokenUri }),
    { enabled: !!tokenUri || !!metadata }
  )

  return {
    loading: isLoading,
    uri: data?.image,
    metadata: data?.metadata,
  }
}

export default useNftImage
