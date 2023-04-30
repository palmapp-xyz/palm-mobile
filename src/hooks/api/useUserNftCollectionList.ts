import apiV1Fabricator from 'libs/apiV1Fabricator'
import _ from 'lodash'
import { useEffect, useMemo } from 'react'
import { useInfiniteQuery } from 'react-query'
import { ApiEnum, ContractAddr, Moralis, SupportedNetworkEnum } from 'types'

import useApi from '../complex/useApi'
import useNetwork from '../complex/useNetwork'

export type UseUserNftCollectionListReturn = {
  nftCollectionList: Moralis.NftCollection[]
  fetchNextPage: () => void
  hasNextPage: boolean
  refetch: () => void
  remove: () => void
  isRefetching: boolean
  isLoading: boolean
}

const useUserNftCollectionList = ({
  selectedNetwork,
  userAddress,
  limit,
}: {
  selectedNetwork: SupportedNetworkEnum
  userAddress?: ContractAddr
  limit?: number
}): UseUserNftCollectionListReturn => {
  const { connectedNetworkIds } = useNetwork()
  const connectedNetworkId = connectedNetworkIds[selectedNetwork]
  const { getApi } = useApi()

  const {
    data,
    fetchNextPage,
    hasNextPage = false,
    refetch,
    remove,
    isRefetching,
    isLoading,
  } = useInfiniteQuery(
    [ApiEnum.COLLECTIONS, userAddress, connectedNetworkId],
    async ({ pageParam = '' }) => {
      if (userAddress) {
        const path = apiV1Fabricator[ApiEnum.COLLECTIONS].get({
          userAddress,
          connectedNetworkId,
          limit,
          cursor: pageParam,
        })
        const fetchResult = await getApi<ApiEnum.COLLECTIONS>({ path })
        if (fetchResult.success) {
          return fetchResult.data
        }
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
      keepPreviousData: false,
      staleTime: 60 * 1000,
    }
  )

  const nftCollectionList = useMemo(
    () => _.flatten(data?.pages.map(x => x.result)),
    [data]
  )

  useEffect(() => {
    remove()
    refetch()
  }, [connectedNetworkId])

  return {
    nftCollectionList,
    fetchNextPage,
    hasNextPage,
    refetch,
    remove,
    isRefetching,
    isLoading,
  }
}

export default useUserNftCollectionList
