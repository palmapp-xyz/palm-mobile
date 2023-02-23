import axios, { AxiosResponse } from 'axios'

import useNetwork from '../complex/useNetwork'
import useReactQuery from 'hooks/complex/useReactQuery'
import { zx } from 'types'

export type UseZxOrdersReturn = {
  orderList: zx.order[]
}

const useZxOrders = (): UseZxOrdersReturn => {
  const { connectedNetworkId } = useNetwork()

  const extApi = `https://api.trader.xyz/orderbook/orders?chainId=${connectedNetworkId}&nftType=erc721&erc20Token=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee`

  const { data: orderList = [] } = useReactQuery([extApi], async () => {
    const fetchRes: AxiosResponse<{ orders: zx.order[] }, any> =
      await axios.get(extApi)
    return fetchRes.data.orders
  })

  return { orderList }
}

export default useZxOrders
