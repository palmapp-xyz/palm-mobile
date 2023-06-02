import useReactQuery from 'hooks/complex/useReactQuery'
import apiV1Fabricator from 'libs/apiV1Fabricator'
import { recordError } from 'libs/logger'
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

  return {
    items: data.result,
    refetch,
    remove,
    isRefetching,
    isLoading,
  }
}

export default useUserFtList
