import apiV1Fabricator from 'libs/apiV1Fabricator'
import { recordError } from 'libs/logger'
import _ from 'lodash'
import { useMemo } from 'react'
import { useInfiniteQuery } from 'react-query'
import { ApiEnum, ContractAddr, Moralis, SupportedNetworkEnum } from 'types'

import useApi from '../complex/useApi'
import useNetwork from '../complex/useNetwork'

export type UseCollectionNftsReturn = {
  items: Moralis.NftItem[]
  fetchNextPage: () => void
  hasNextPage: boolean
  refetch: () => void
  remove: () => void
  isRefetching: boolean
  isLoading: boolean
}

const useCollectionNfts = ({
  selectedNetwork,
  userAddress,
  contractAddress,
  limit,
}: {
  selectedNetwork: SupportedNetworkEnum
  userAddress?: ContractAddr
  contractAddress: ContractAddr
  limit?: number
}): UseCollectionNftsReturn => {
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
    [
      ApiEnum.COLLECTION_ASSETS,
      userAddress,
      contractAddress,
      connectedNetworkId,
    ],
    async ({ pageParam = '' }) => {
      if (userAddress) {
        const path = apiV1Fabricator[ApiEnum.COLLECTION_ASSETS].get({
          userAddress,
          contractAddress,
          connectedNetworkId,
          limit,
          cursor: pageParam,
        })
        const fetchResult = await getApi<ApiEnum.COLLECTION_ASSETS>({ path })

        if (fetchResult.success) {
          return fetchResult.data
        } else {
          recordError(new Error(fetchResult.errMsg), 'useCollectionNfts')
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
    () => _.flatten(data?.pages.map(x => x.result)).filter(x => !!x),
    [data]
  )

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

export default useCollectionNfts
