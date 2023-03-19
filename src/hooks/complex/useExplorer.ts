import { useCallback } from 'react'

import useSetting from 'hooks/independent/useSetting'
import { NETWORK } from 'consts'

export type UseExplorerReturn = {
  getLink: (props: { address: string; type: 'tx' | 'account' }) => string
}

const useExplorer = (): UseExplorerReturn => {
  const { setting } = useSetting()
  const endpoint = NETWORK.chainParam[setting.network].blockExplorerUrls[0]
  const getLink = useCallback(
    ({ address, type }: { address: string; type: 'tx' | 'account' }): string =>
      `https://${endpoint}/${type}/${address}`,
    [setting.network]
  )

  return { getLink }
}

export default useExplorer
