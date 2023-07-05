import _ from 'lodash'
import { UTIL } from 'palm-core/libs'
import apiV1Fabricator from 'palm-core/libs/apiV1Fabricator'
import { recordError } from 'palm-core/libs/logger'
import { chainId } from 'palm-core/libs/network'
import {
  ApiEnum,
  ContractAddr,
  Moralis,
  SupportedNetworkEnum,
} from 'palm-core/types'
import { useMemo } from 'react'
import { useInfiniteQuery } from 'react-query'

import useApi from '../complex/useApi'

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
  const connectedNetworkId = chainId(selectedNetwork)
  const { getApi } = useApi()

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

  const items = useMemo(
    () =>
      _.flatten(data?.pages.map(x => x.result)).filter(
        x => !!x && !(UTIL.isMainnet() && x.possible_spam === true)
      ),
    [data]
  )

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
