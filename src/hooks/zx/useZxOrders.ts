import axios, { AxiosResponse } from 'axios'

import useNetwork from '../complex/useNetwork'
import useReactQuery from 'hooks/complex/useReactQuery'
import { QueryKeyEnum, SupportedNetworkEnum, zx } from 'types'

export type UseZxOrdersReturn = {
  orderList: zx.order[]
  refetch: () => void
  isFetching: boolean
}

const useZxOrders = (): UseZxOrdersReturn => {
  const { connectedNetworkIds } = useNetwork()
  const connectedNetworkId = connectedNetworkIds[SupportedNetworkEnum.ETHEREUM]

  const extApi = `https://api.trader.xyz/orderbook/orders?chainId=${connectedNetworkId}&nftType=erc721&erc20Token=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee`

  const {
    data: orderList = [],
    refetch,
    isFetching,
  } = useReactQuery([QueryKeyEnum.ZX_ORDERS, connectedNetworkId], async () => {
    const fetchRes: AxiosResponse<{ orders: zx.order[] }, any> =
      await axios.get(extApi)
    return fetchRes.data.orders
  })

  return { orderList, refetch, isFetching }
}

export default useZxOrders
