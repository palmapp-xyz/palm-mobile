import _ from 'lodash'
import { getUserNftCollectionList } from 'palm-core/api/userNftCollectionList'
import {
  ApiEnum,
  ContractAddr,
  Moralis,
  SupportedNetworkEnum,
} from 'palm-core/types'
import { useMemo } from 'react'
import { useInfiniteQuery } from 'react-query'

import { UseUserAssetsReturn } from './useUserNftList'

const useUserNftCollectionList = ({
  selectedNetwork,
  userAddress,
  limit,
}: {
  selectedNetwork: SupportedNetworkEnum
  userAddress?: ContractAddr
  limit?: number
}): UseUserAssetsReturn<Moralis.NftCollection> => {
  const {
    data,
    fetchNextPage,
    hasNextPage = false,
    refetch,
    remove,
    isLoading,
    isFetchingNextPage,
    isRefetching,
  } = useInfiniteQuery(
    [ApiEnum.COLLECTIONS, userAddress, selectedNetwork],
    async ({ pageParam = '' }) => {
      if (userAddress) {
        return await getUserNftCollectionList({
          selectedNetwork,
          userAddress,
          limit,
          cursor: pageParam,
        })
      }
      return {
        page: 0,
        page_size: 0,
        cursor: null,
        result: [] as Moralis.NftCollection[],
      }
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
    loading,
    isRefetching,
  }
}

export default useUserNftCollectionList
