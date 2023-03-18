import { useCallback } from 'react'

import { ChainNetworkEnum } from 'types'
import useSetting from 'hooks/independent/useSetting'

export type UseExplorerReturn = {
  getLink: (props: { address: string; type: 'tx' | 'account' }) => string
}

const useExplorer = (): UseExplorerReturn => {
  const { setting } = useSetting()
  let networkPath
  let endpoint
  switch (setting.network) {
    case ChainNetworkEnum.ETHEREUM:
      endpoint = 'etherscan'
      networkPath = ''
      break
    case ChainNetworkEnum.GOERLI:
      endpoint = 'etherscan'
      networkPath = 'goerli'
      break
    case ChainNetworkEnum.CYPRESS:
      endpoint = 'klaytnfinder'
      networkPath = ''
      break
    case ChainNetworkEnum.BAOBAB:
      endpoint = 'klaytnfinder'
      networkPath = 'baobad'
      break
    default:
      break
  }
  const getLink = useCallback(
    ({ address, type }: { address: string; type: 'tx' | 'account' }): string =>
      `https://${networkPath}${endpoint}.io/${type}/${address}`,
    [networkPath]
  )

  return { getLink }
}

export default useExplorer
