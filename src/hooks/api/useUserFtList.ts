import { UTIL } from 'consts'
import useReactQuery from 'hooks/complex/useReactQuery'
import useNativeToken from 'hooks/independent/useNativeToken'
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
  status: 'idle' | 'error' | 'loading' | 'success'
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

  const { nativeToken } = useNativeToken({
    userAddress,
    network: selectedNetwork,
  })

  const {
    data = { result: [] },
    refetch,
    remove,
    isRefetching,
    status,
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

  const items = useMemo(() => {
    const ret = nativeToken ? [nativeToken] : []
    return _.flatten(
      ret.concat(
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
      )
    )
  }, [selectedNetwork, nativeToken, data])

  return {
    items,
    refetch,
    remove,
    isRefetching,
    status,
  }
}

export default useUserFtList
