import axios, { AxiosResponse } from 'axios'

import useNetwork from '../complex/useNetwork'
import useReactQuery from 'hooks/complex/useReactQuery'
import { QueryKeyEnum, zx } from 'types'

export type UseZxOrderReturn = {
  order?: zx.order
  isLoading: boolean
}

const useZxOrder = ({ nonce }: { nonce: string }): UseZxOrderReturn => {
  const { connectedNetworkId } = useNetwork()

  const extApi = `https://api.trader.xyz/orderbook/orders?chainId=${connectedNetworkId}&nftType=erc721&erc20Token=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&nonce=${nonce}`

  const { data: order, isLoading } = useReactQuery(
    [QueryKeyEnum.ZX_ORDER, connectedNetworkId, nonce],
    async () => {
      const fetchRes: AxiosResponse<{ orders: zx.order[] }, any> =
        await axios.get(extApi)
      return fetchRes.data.orders[0]
    }
  )

  return { order, isLoading }
}

export default useZxOrder
