import { useCallback } from 'react'

import { ChainNetworkEnum } from 'types'
import useSetting from 'hooks/independent/useSetting'

export type UseExplorerReturn = {
  getLink: (props: { address: string; type: 'tx' | 'account' }) => string
}

const useExplorer = (): UseExplorerReturn => {
  const { setting } = useSetting()
  const networkPath =
    setting.network !== ChainNetworkEnum.ETHEREUM ? `${setting.network}.` : ''

  const getLink = useCallback(
    ({ address, type }: { address: string; type: 'tx' | 'account' }): string =>
      `https://${networkPath}etherscan.io/${type}/${address}`,
    [networkPath]
  )

  return { getLink }
}

export default useExplorer
