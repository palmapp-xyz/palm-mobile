import { UTIL } from 'consts'
import useReactQuery from 'hooks/complex/useReactQuery'
import apiV1Fabricator from 'libs/apiV1Fabricator'
import { recordError } from 'libs/logger'
import _ from 'lodash'
import { useMemo } from 'react'
import { ApiEnum, ContractAddr, Moralis, SupportedNetworkEnum } from 'types'

import useApi from '../complex/useApi'
import useNetwork from '../complex/useNetwork'

export type UseUserFtListReturn = {
  items: Moralis.FtItem[]
  refetch: () => void
  remove: () => void
  isRefetching: boolean
  isLoading: boolean
}

const useUserFtList = ({
  selectedNetwork,
  userAddress,
}: {
  selectedNetwork: SupportedNetworkEnum
  userAddress?: ContractAddr
}): UseUserFtListReturn => {
  const { connectedNetworkIds } = useNetwork()
  const connectedNetworkId = connectedNetworkIds[selectedNetwork]
  const { getApi } = useApi()

  const {
    data = { result: [] },
    refetch,
    remove,
    isRefetching,
    isLoading,
  } = useReactQuery(
    [ApiEnum.TOKENS, userAddress, connectedNetworkId],
    async () => {
      if (userAddress) {
        const path = apiV1Fabricator[ApiEnum.TOKENS].get({
          userAddress,
          connectedNetworkId,
        })
        const fetchResult = await getApi<ApiEnum.TOKENS>({ path })

        if (fetchResult.success) {
          return fetchResult.data
        } else {
          recordError(new Error(fetchResult.errMsg), 'useUserFtList')
        }
      }
      return {
        result: [] as Moralis.FtItem[],
      }
    },
    {
      enabled: !!userAddress,
    }
  )

  const items = useMemo(
    () =>
      _.flatten(
        data.result.sort((a, b) => {
          if (!a.price && !b.price) {
            return a.balance >= b.balance ? -1 : 1
          } else if (!a.price) {
            return 1
          } else if (!b.price) {
            return -1
          } else {
            return (
              -1 *
              UTIL.toBn(a.balance)
                .multipliedBy(a.price.usdPrice)
                .comparedTo(UTIL.toBn(b.balance).multipliedBy(b.price.usdPrice))
            )
          }
        })
      ),
    [data]
  )

  return {
    items,
    refetch,
    remove,
    isRefetching,
    isLoading,
  }
}

export default useUserFtList
