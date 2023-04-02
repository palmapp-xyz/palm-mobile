import { Maybe } from '@toruslabs/openlogin'
import { UTIL } from 'consts'
import useReactQuery from 'hooks/complex/useReactQuery'
import useNft from 'hooks/contract/useNft'
import { fetchNftImage } from 'libs/fetchTokenUri'
import _ from 'lodash'
import {
  ContractAddr,
  NftType,
  QueryKeyEnum,
  SupportedNetworkEnum,
} from 'types'

export type UseNftImageReturn = {
  loading: boolean
  uri?: string
  metadata?: Maybe<string>
  refetch: () => void
  isRefetching: boolean
}

const useNftImage = ({
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
}): UseNftImageReturn => {
  const { tokenURI, URI } = useNft({ nftContract, chain })

  const {
    data: tokenUri = '',
    refetch: tokenURIRefetch,
    remove: tokenURIRemove,
    isRefetching: tokenURIFetching,
  } = useReactQuery(
    [QueryKeyEnum.NFT_TOKEN_URI, nftContract, tokenId, chain],
    async () => {
      const uri =
        type === NftType.ERC721
          ? await tokenURI({ tokenId })
          : await URI({ tokenId })

      if (uri && UTIL.isURL(uri.trim())) {
        return uri.trim()
      }
    }
  )

  const {
    data,
    isLoading,
    refetch: fetchNftImageRefetch,
    remove: fetchNftImageRemove,
    isRefetching: fetchNftImageFetching,
  } = useReactQuery(
    [QueryKeyEnum.MORALIS_NFT_IMAGE, tokenUri, metadata],
    () => fetchNftImage({ metadata, tokenUri }),
    { enabled: !!tokenUri || !!metadata }
  )

  const refetch = async (): Promise<void> => {
    tokenURIRemove()
    fetchNftImageRemove()
    await Promise.all([tokenURIRefetch(), fetchNftImageRefetch()])
  }

  return {
    loading: isLoading,
    uri: data?.image,
    metadata: data?.metadata,
    refetch,
    isRefetching: tokenURIFetching || fetchNftImageFetching,
  }
}

export default useNftImage
