import { getPkey } from 'core/libs/account'
import { QueryKeyEnum, SupportedNetworkEnum } from 'core/types'
import { VoidSigner, ethers } from 'ethers'
import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { IBindings } from '@lens-protocol/react'

import useNetwork from './useNetwork'

type UseWeb3BindingsReturn = {
  provider: ethers.providers.JsonRpcProvider
  bindings: IBindings
}

const useWeb3Bindings = (
  chain: SupportedNetworkEnum
): UseWeb3BindingsReturn => {
  const { connectedNetworkParams, connectedNetworkIds } = useNetwork()
  const connectedNetworkId = connectedNetworkIds[chain]
  const connectedNetworkParam = connectedNetworkParams[chain]

  const provider = useMemo(
    () =>
      new ethers.providers.JsonRpcProvider(connectedNetworkParam.rpcUrls[0]),
    [connectedNetworkId]
  )

  const {
    data: bindings = {
      getProvider: async () => provider,
      getSigner: async () => new VoidSigner(''),
    },
  } = useQuery([QueryKeyEnum.WEB3_BINDINGS, provider], async () => {
    try {
      const pKey = await getPkey()
      if (pKey) {
        const signer = new ethers.Wallet(pKey, provider)
        return {
          getProvider: async () => provider,
          getSigner: async () => signer,
        }
      }
    } catch {}
  })

  return { provider, bindings }
}

export default useWeb3Bindings
