import { useEffect, useMemo } from 'react'
import _ from 'lodash'
import { useInfiniteQuery } from 'react-query'

import { ApiEnum, ContractAddr, Moralis, SupportedNetworkEnum } from 'types'

import useNetwork from '../complex/useNetwork'
import useApi from '../complex/useApi'
import apiV1Fabricator from 'libs/apiV1Fabricator'

export type UseUserNftListReturn = {
  nftList: Moralis.NftItem[]
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
}): UseUserNftListReturn => {
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
    }
  )

  const nftList = useMemo(
    () => _.flatten(data?.pages.map(x => x.result)),
    [data]
  )

  useEffect(() => {
    remove()
    refetch()
  }, [connectedNetworkId])

  return {
    nftList,
    fetchNextPage,
    hasNextPage,
    refetch,
    remove,
    isRefetching,
    isLoading,
  }
}

export default useUserNftList
