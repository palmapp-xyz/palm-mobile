import apiV1Fabricator from 'libs/apiV1Fabricator'
import { recordError } from 'libs/logger'
import _ from 'lodash'
import { useMemo } from 'react'
import { useInfiniteQuery } from 'react-query'
import { ApiEnum, ContractAddr, Moralis, SupportedNetworkEnum } from 'types'

import useApi from '../complex/useApi'
import useNetwork from '../complex/useNetwork'

export type UseUserAssetsReturn<T> = {
  items: T[]
  fetchNextPage: () => void
  hasNextPage: boolean
  refetch: () => void
  remove: () => void
  isRefetching: boolean
  isLoading: boolean
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
    [ApiEnum.ASSETS, userAddress, connectedNetworkId],
    async ({ pageParam = '' }) => {
      if (userAddress) {
        const path = apiV1Fabricator[ApiEnum.ASSETS].get({
          userAddress,
          connectedNetworkId,
          limit,
          cursor: pageParam,
        })
        const fetchResult = await getApi<ApiEnum.ASSETS>({ path })

        if (fetchResult.success) {
          return fetchResult.data
        } else {
          recordError(new Error(fetchResult.errMsg), 'useUserNftList')
        }
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

  return {
    items,
    fetchNextPage,
    hasNextPage,
    refetch,
    remove,
    isRefetching,
    isLoading,
  }
}

export default useUserNftList
