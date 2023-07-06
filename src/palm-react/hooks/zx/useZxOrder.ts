import axios, { AxiosResponse } from 'axios'
import { PostOrderResponsePayload } from 'evm-nft-swap/dist/sdk/v4/orderbook'
import { chainId } from 'palm-core/libs/network'
import { QueryKeyEnum, SupportedNetworkEnum } from 'palm-core/types'
import useReactQuery from 'palm-react/hooks/complex/useReactQuery'
import useFsListing from 'palm-react/hooks/firestore/useFsListing'

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
  const connectedNetworkId = chainId(chain)
  const { fsListingField } = useFsListing({ nonce })

  const extApi = `https://api.trader.xyz/orderbook/orders?chainId=${connectedNetworkId}&nftType=erc721&erc20Token=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&nonce=${nonce}`

  const { data: order, isLoading } = useReactQuery(
    [QueryKeyEnum.ZX_ORDER, connectedNetworkId, nonce],
    async () => {
      if (chain === SupportedNetworkEnum.KLAYTN) {
        return fsListingField?.order
      } else {
        const fetchRes: AxiosResponse<
          { orders: PostOrderResponsePayload[] },
          any
        > = await axios.get(extApi)
        return fetchRes.data.orders.length > 0
          ? fetchRes.data.orders[0]
          : undefined
      }
    }
  )

  return { order, isLoading }
}

export default useZxOrder
