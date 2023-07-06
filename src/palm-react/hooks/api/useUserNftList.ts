import _ from 'lodash'
import { getUserNfts } from 'palm-core/api/userNftList'
import {
  ApiEnum,
  ContractAddr,
  Moralis,
  SupportedNetworkEnum,
} from 'palm-core/types'
import { useMemo } from 'react'
import { useInfiniteQuery } from 'react-query'

export type UseUserAssetsReturn<T> = {
  items: T[]
  fetchNextPage: () => void
  hasNextPage: boolean
  refetch: () => void
  remove: () => void
  loading: boolean
  isRefetching: boolean
}

const useUserNftList = ({
  selectedNetwork,
  userAddress,
  limit,
}: {
  selectedNetwork: SupportedNetworkEnum
  userAddress?: ContractAddr
  limit?: number
}): UseUserAssetsReturn<Moralis.NftItem> => {
  const {
    data,
    fetchNextPage,
    hasNextPage = false,
    refetch,
    remove,
    isLoading,
    isRefetching,
    isFetchingNextPage,
  } = useInfiniteQuery(
    [ApiEnum.ASSETS, userAddress, selectedNetwork],
    async ({ pageParam = '' }) => {
      if (userAddress) {
        return await getUserNfts({
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
        result: [] as Moralis.NftItem[],
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

export default useUserNftList
