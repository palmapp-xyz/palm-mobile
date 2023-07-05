import _ from 'lodash'
import { getUserCollectionNfts } from 'palm-core/api/userCollectionNfts'
import {
  ApiEnum,
  ContractAddr,
  Moralis,
  SupportedNetworkEnum,
} from 'palm-core/types'
import { useMemo } from 'react'
import { useInfiniteQuery } from 'react-query'

export type UseCollectionNftsReturn = {
  items: Moralis.NftItem[]
  fetchNextPage: () => void
  hasNextPage: boolean
  refetch: () => void
  remove: () => void
  isRefetching: boolean
  loading: boolean
}

const useCollectionNfts = ({
  selectedNetwork,
  userAddress,
  contractAddress,
  limit,
  preload,
}: {
  selectedNetwork: SupportedNetworkEnum
  userAddress?: ContractAddr
  contractAddress: ContractAddr
  limit?: number
  preload?: Moralis.NftItemsFetchResult | null | undefined
}): UseCollectionNftsReturn => {
  const {
    data,
    fetchNextPage,
    hasNextPage = false,
    refetch,
    remove,
    isRefetching,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery(
    [ApiEnum.COLLECTION_ASSETS, userAddress, contractAddress, selectedNetwork],
    async ({ pageParam = '' }) => {
      if (userAddress) {
        if (preload && pageParam === '') {
          return preload
        }

        return await getUserCollectionNfts({
          selectedNetwork,
          userAddress,
          contractAddress,
          limit,
          cursor: pageParam,
        })
      }
      return {
        page: 0,
        page_size: 0,
        cursor: null,
        result: [] as Moralis.NftItem[],
      } as Moralis.NftItemsFetchResult
    },
    {
      getNextPageParam: lastPage => lastPage.cursor,
      enabled: !!userAddress,
    }
  )

  const items = useMemo(() => _.flatten(data?.pages.map(x => x.result)), [data])

  const loading = useMemo(
    () => isLoading || isFetchingNextPage,
    [isLoading, isFetchingNextPage]
  )

  return {
    items,
    fetchNextPage,
    hasNextPage,
    refetch,
    remove,
    isRefetching,
    loading,
  }
}

export default useCollectionNfts
