import axios, { AxiosResponse } from 'axios'
import { PostOrderResponsePayload } from 'evm-nft-swap/dist/sdk/v4/orderbook'
import { chainId } from 'palm-core/libs/network'
import { QueryKeyEnum, SupportedNetworkEnum } from 'palm-core/types'
import useReactQuery from 'palm-react/hooks/complex/useReactQuery'

export type UseZxOrdersReturn = {
  orderList: PostOrderResponsePayload[]
  refetch: () => void
  remove: () => void
  isFetching: boolean
}

const useZxOrders = (chain: SupportedNetworkEnum): UseZxOrdersReturn => {
  const connectedNetworkId = chainId(chain)

  const token = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
  const extApi = `https://api.trader.xyz/orderbook/orders?chainId=${connectedNetworkId}&nftType=erc721&erc20Token=${token}`

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
