import axios from 'axios'
import { UTIL } from 'core/libs'
import { pToken, QueryKeyEnum } from 'core/types'
import { useQuery } from 'react-query'

export type UseEthPriceReturn = {
  getEthPrice: (amount: pToken) => pToken
}

const useEthPrice = (): UseEthPriceReturn => {
  const apiPath =
    'https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=0.1'

  const { data: price = 0 } = useQuery(
    [QueryKeyEnum.ETH_USD_PRICE],
    async () => {
      const res = await axios.get<{ prices: [number, number][] }>(apiPath)
      const lastItem = res.data.prices.pop()
      if (lastItem) {
        return lastItem[1]
      }
    },
    {
      keepPreviousData: true,
      refetchInterval: 10000,
    }
  )

  const getEthPrice = (amount: pToken): pToken => {
    return UTIL.toBn(amount).multipliedBy(price).toString(10) as pToken
  }

  return { getEthPrice }
}

export default useEthPrice
