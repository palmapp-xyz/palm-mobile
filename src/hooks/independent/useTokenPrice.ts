import useApi from 'hooks/complex/useApi'
import useNetwork from 'hooks/complex/useNetwork'
import useReactQuery from 'hooks/complex/useReactQuery'
import apiV1Fabricator from 'palm-core/libs/apiV1Fabricator'
import { recordError } from 'palm-core/libs/logger'
import {
  ApiEnum,
  ContractAddr,
  Moralis,
  SupportedNetworkEnum,
} from 'palm-core/types'

export type UseTokenPriceReturn = {
  price: Moralis.TokenPrice | undefined
}

const useTokenPrice = ({
  tokenAddress,
  selectedNetwork,
}: {
  tokenAddress: ContractAddr
  selectedNetwork: SupportedNetworkEnum
}): UseTokenPriceReturn => {
  const { connectedNetworkIds } = useNetwork()
  const connectedNetworkId = connectedNetworkIds[selectedNetwork]
  const { getApi } = useApi()

  const { data: price } = useReactQuery(
    [ApiEnum.TOKEN_PRICE, tokenAddress, connectedNetworkId],
    async () => {
      if (tokenAddress) {
        const path = apiV1Fabricator[ApiEnum.TOKEN_PRICE].get({
          tokenAddress,
          connectedNetworkId,
        })
        const fetchResult = await getApi<ApiEnum.TOKEN_PRICE>({ path })

        if (fetchResult.success) {
          return fetchResult.data
        } else {
          recordError(
            new Error(fetchResult.errMsg),
            `useTokenPrice ${tokenAddress} (${selectedNetwork}): ${path}`
          )
        }
      }
      return undefined
    },
    {
      enabled:
        !!tokenAddress &&
        (selectedNetwork === SupportedNetworkEnum.ETHEREUM ||
          selectedNetwork === SupportedNetworkEnum.POLYGON),
      keepPreviousData: true,
      refetchInterval: 10000,
    }
  )

  return { price }
}

export default useTokenPrice
