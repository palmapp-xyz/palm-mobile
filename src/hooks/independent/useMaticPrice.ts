import axios from 'axios'
import { UTIL } from 'consts'
import { useQuery } from 'react-query'
import { pToken, QueryKeyEnum } from 'types'

export type UseMaticPriceReturn = {
  getMaticPrice: (amount: pToken) => pToken
}

const useMaticPrice = (): UseMaticPriceReturn => {
  const apiPath =
    'https://api.coingecko.com/api/v3/coins/matic-network/market_chart?vs_currency=usd&days=0.1'

  const { data: price = 0 } = useQuery(
    [QueryKeyEnum.KLAY_USD_PRICE],
    async () => {
      const res = await axios.get<{ prices: [number, number][] }>(apiPath)
      const lastItem = res.data.prices.pop()
      if (lastItem) {
        return lastItem[1]
      }
    },
    {
      keepPreviousData: true,
      refetchInterval: 100000,
    }
  )

  const getMaticPrice = (amount: pToken): pToken => {
    return UTIL.toBn(amount).multipliedBy(price).toString(10) as pToken
  }

  return { getMaticPrice }
}

export default useMaticPrice
