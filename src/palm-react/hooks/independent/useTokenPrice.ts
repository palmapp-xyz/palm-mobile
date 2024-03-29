import apiV1Fabricator from 'palm-core/libs/apiV1Fabricator'
import { recordError } from 'palm-core/libs/logger'
import { chainId } from 'palm-core/libs/network'
import {
  ApiEnum,
  ContractAddr,
  Moralis,
  SupportedNetworkEnum,
} from 'palm-core/types'
import useApi from 'palm-react/hooks/complex/useApi'
import useReactQuery from 'palm-react/hooks/complex/useReactQuery'

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
  const connectedNetworkId = chainId(selectedNetwork)
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
