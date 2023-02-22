import { NftSwapV4 } from '@traderxyz/nft-swap-sdk'
import { ethers } from 'ethers'
import { useMemo } from 'react'

import useNetwork from 'hooks/complex/useNetwork'
import useWeb3 from 'hooks/complex/useWeb3'

export type UseZxReturn = { nftSwapSdk?: NftSwapV4 }

const useZx = (): UseZxReturn => {
  const { connectedNetworkId } = useNetwork()
  const { web3 } = useWeb3()

  const nftSwapSdk = useMemo(() => {
    try {
      const provider = new ethers.providers.Web3Provider(web3.givenProvider)

      return new NftSwapV4(provider, provider.getSigner(), connectedNetworkId)
    } catch {}
  }, [connectedNetworkId, web3])

  return { nftSwapSdk }
}

export default useZx
