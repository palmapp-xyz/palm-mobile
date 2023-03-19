import { NftSwapV4 } from '@traderxyz/nft-swap-sdk'
import { ethers } from 'ethers'
import { useQuery } from 'react-query'

import useNetwork from 'hooks/complex/useNetwork'
import { getPkey } from 'libs/account'
import { QueryKeyEnum, SupportedNetworkEnum } from 'types'

export type UseZxReturn = { nftSwapSdk?: NftSwapV4 }

const useZx = (): UseZxReturn => {
  const { connectedNetworkParams, connectedNetworkIds } = useNetwork()
  const connectedNetworkId = connectedNetworkIds[SupportedNetworkEnum.ETHEREUM]
  const connectedNetworkParam =
    connectedNetworkParams[SupportedNetworkEnum.ETHEREUM]

  const { data: nftSwapSdk } = useQuery(
    [QueryKeyEnum.ZX_SWAP_SDK_V4, connectedNetworkParam, connectedNetworkId],
    async () => {
      try {
        const pKey = await getPkey()

        const provider = new ethers.providers.JsonRpcProvider(
          connectedNetworkParam.rpcUrls[0]
        )
        const signer = new ethers.Wallet(pKey, provider)
        return new NftSwapV4(provider, signer, connectedNetworkId)
      } catch {}
    }
  )

  return { nftSwapSdk }
}

export default useZx
