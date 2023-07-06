import { NETWORK } from 'palm-core/consts'
import { UTIL } from 'palm-core/libs'
import { NetworkTypeEnum, SupportedNetworkEnum } from 'palm-core/types'
import { useCallback, useMemo } from 'react'

export type UseExplorerReturn = {
  getLink: (props: {
    address: string
    tokenId?: string
    type: 'tx' | 'address' | 'nft'
  }) => string
}

const useExplorer = (network: SupportedNetworkEnum): UseExplorerReturn => {
  const mainnet = UTIL.isMainnet()

  const endpoint = useMemo(
    () =>
      NETWORK.chainParams[
        mainnet ? NetworkTypeEnum.MAINNET : NetworkTypeEnum.TESTNET
      ]?.[network]?.blockExplorerUrls[0],
    [network]
  )

  const getLink = useCallback(
    ({
      address,
      type,
      tokenId,
    }: {
      address: string
      tokenId?: string
      type: 'tx' | 'address' | 'nft'
    }): string => {
      if (type === 'tx') {
        return `${endpoint}/${type}/${address}`
      }

      if (network === SupportedNetworkEnum.POLYGON) {
        return type === 'nft' && tokenId
          ? `${endpoint}/token/${address}?a=${tokenId}`
          : `${endpoint}/token/${address}/${tokenId}`
      }

      tokenId =
        tokenId &&
        Number(tokenId) >= 0 &&
        Number(tokenId) < Number.MAX_SAFE_INTEGER
          ? `${Number(tokenId)}`
          : tokenId

      return tokenId
        ? `${endpoint}/${type}/${address}/${tokenId}`
        : `${endpoint}/${type}/${address}`
    },
    [endpoint]
  )

  return { getLink }
}

export default useExplorer
