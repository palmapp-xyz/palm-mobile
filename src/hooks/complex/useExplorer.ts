import { useCallback } from 'react'

import { NETWORK } from 'consts'
import { NetworkTypeEnum, SupportedNetworkEnum } from 'types'
import { isMainnet } from 'libs/utils'

export type UseExplorerReturn = {
  getLink: (props: { address: string; type: 'tx' | 'address' }) => string
}

const useExplorer = (network: SupportedNetworkEnum): UseExplorerReturn => {
  const mainnet = isMainnet()

  const endpoint =
    NETWORK.chainParams[
      mainnet ? NetworkTypeEnum.MAINNET : NetworkTypeEnum.TESTNET
    ]?.[network]?.blockExplorerUrls[0]
  const getLink = useCallback(
    ({ address, type }: { address: string; type: 'tx' | 'address' }): string =>
      `${endpoint}/${type}/${address}`,
    []
  )

  return { getLink }
}

export default useExplorer
