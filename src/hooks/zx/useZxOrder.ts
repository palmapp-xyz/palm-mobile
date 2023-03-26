import axios, { AxiosResponse } from 'axios'

import useNetwork from '../complex/useNetwork'
import useReactQuery from 'hooks/complex/useReactQuery'
import { QueryKeyEnum, SupportedNetworkEnum } from 'types'
import { PostOrderResponsePayload } from 'evm-nft-swap/dist/sdk/v4/orderbook'

export type UseZxOrderReturn = {
  order?: PostOrderResponsePayload
  isLoading: boolean
}

const useZxOrder = ({
  nonce,
  chain,
}: {
  nonce: string
  chain: SupportedNetworkEnum
}): UseZxOrderReturn => {
  const { connectedNetworkIds } = useNetwork()
  const connectedNetworkId = connectedNetworkIds[chain]

  const extApi = `https://api.trader.xyz/orderbook/orders?chainId=${connectedNetworkId}&nftType=erc721&erc20Token=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&nonce=${nonce}`

  const { data: order, isLoading } = useReactQuery(
    [QueryKeyEnum.ZX_ORDER, connectedNetworkId, nonce],
    async () => {
      const fetchRes: AxiosResponse<
        { orders: PostOrderResponsePayload[] },
        any
      > = await axios.get(extApi)
      return fetchRes.data.orders[0]
    }
  )

  return { order, isLoading }
}

export default useZxOrder
