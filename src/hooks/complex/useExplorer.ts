import { useCallback } from 'react'

import useSetting from 'hooks/independent/useSetting'
import { NETWORK } from 'consts'
import { SupportedNetworkEnum } from 'types'

export type UseExplorerReturn = {
  getLink: (props: { address: string; type: 'tx' | 'address' }) => string
}

const useExplorer = (network: SupportedNetworkEnum): UseExplorerReturn => {
  const { setting } = useSetting()
  const endpoint =
    NETWORK.chainParams[setting.network]?.[network]?.blockExplorerUrls[0]
  const getLink = useCallback(
    ({ address, type }: { address: string; type: 'tx' | 'address' }): string =>
      `${endpoint}/${type}/${address}`,
    [setting.network]
  )

  return { getLink }
}

export default useExplorer
