import axios from 'axios'
import { UTIL } from 'core/consts'
import { pToken, QueryKeyEnum } from 'core/types'
import { useQuery } from 'react-query'

export type UseKlayPriceReturn = {
  getKlayPrice: (amount: pToken) => pToken
}

const useKlayPrice = (): UseKlayPriceReturn => {
  const apiPath =
    'https://api.coingecko.com/api/v3/coins/klay-token/market_chart?vs_currency=usd&days=0.1'

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
      refetchInterval: 10000,
    }
  )

  const getKlayPrice = (amount: pToken): pToken => {
    return UTIL.toBn(amount).multipliedBy(price).toString(10) as pToken
  }

  return { getKlayPrice }
}

export default useKlayPrice
