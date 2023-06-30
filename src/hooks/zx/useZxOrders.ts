import axios, { AxiosResponse } from 'axios'
import { QueryKeyEnum, SupportedNetworkEnum } from 'core/types'
import { PostOrderResponsePayload } from 'evm-nft-swap/dist/sdk/v4/orderbook'
import useReactQuery from 'hooks/complex/useReactQuery'

import useNetwork from '../complex/useNetwork'

export type UseZxOrdersReturn = {
  orderList: PostOrderResponsePayload[]
  refetch: () => void
  remove: () => void
  isFetching: boolean
}

const useZxOrders = (chain: SupportedNetworkEnum): UseZxOrdersReturn => {
  const { connectedNetworkIds } = useNetwork()
  const connectedNetworkId = connectedNetworkIds[chain]

  const extApi = `https://api.trader.xyz/orderbook/orders?chainId=${connectedNetworkId}&nftType=erc721&erc20Token=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee`

  const {
    data: orderList = [],
    refetch,
    remove,
    isFetching,
  } = useReactQuery([QueryKeyEnum.ZX_ORDERS, connectedNetworkId], async () => {
    const fetchRes: AxiosResponse<{ orders: PostOrderResponsePayload[] }, any> =
      await axios.get(extApi)
    return fetchRes.data.orders
  })

  return { orderList, refetch, remove, isFetching }
}

export default useZxOrders
