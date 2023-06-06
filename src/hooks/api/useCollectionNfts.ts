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
    isFetchingNextPage,
  } = useInfiniteQuery(
    [
      ApiEnum.COLLECTION_ASSETS,
      userAddress,
      contractAddress,
      connectedNetworkId,
    ],
    async ({ pageParam = '' }) => {
      if (userAddress) {
        if (preload && pageParam == '') {
          return preload
        }

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
      } as Moralis.NftItemsFetchResult
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
