import { UTIL } from 'consts'
import useApi from 'hooks/complex/useApi'
import useNetwork from 'hooks/complex/useNetwork'
import useReactQuery from 'hooks/complex/useReactQuery'
import apiV1Fabricator from 'libs/apiV1Fabricator'
import { recordError } from 'libs/logger'
import {
  ApiEnum,
  ContractAddr,
  Moralis,
  pToken,
  SupportedNetworkEnum,
} from 'types'

export type UseTokenPriceReturn = {
  price: Moralis.TokenPrice | undefined
  getTokenPrice: (amount: pToken) => pToken | undefined
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

  const getTokenPrice = (amount: pToken): pToken | undefined => {
    if (!price) {
      return undefined
    }
    return UTIL.toBn(amount).multipliedBy(price.usdPrice).toString(10) as pToken
  }

  return { price, getTokenPrice }
}

export default useTokenPrice
