import { NETWORK } from 'consts'
import { isMainnet } from 'libs/utils'
import { useCallback } from 'react'
import { NetworkTypeEnum, SupportedNetworkEnum } from 'types'

export type UseExplorerReturn = {
  getLink: (props: {
    address: string
    tokenId?: string
    type: 'tx' | 'address' | 'nft'
  }) => string
}

const useExplorer = (network: SupportedNetworkEnum): UseExplorerReturn => {
  const mainnet = isMainnet()

  const endpoint =
    NETWORK.chainParams[
      mainnet ? NetworkTypeEnum.MAINNET : NetworkTypeEnum.TESTNET
    ]?.[network]?.blockExplorerUrls[0]
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
    []
  )

  return { getLink }
}

export default useExplorer
