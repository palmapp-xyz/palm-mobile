import { NETWORK } from 'core/consts'
import { UTIL } from 'core/libs'
import { NetworkTypeEnum, SupportedNetworkEnum } from 'core/types'

export const getExplorerLink = ({
  address,
  type,
  tokenId,
  network,
}: {
  address: string
  tokenId?: string
  type: 'tx' | 'address' | 'nft'
  network: SupportedNetworkEnum
}): string => {
  const mainnet = UTIL.isMainnet()

  const endpoint =
    NETWORK.chainParams[
      mainnet ? NetworkTypeEnum.MAINNET : NetworkTypeEnum.TESTNET
    ]?.[network]?.blockExplorerUrls[0]

  if (type === 'tx') {
    return `${endpoint}/${type}/${address}`
  }

  if (network === SupportedNetworkEnum.POLYGON) {
    return type === 'nft' && tokenId
      ? `${endpoint}/token/${address}?a=${tokenId}`
      : `${endpoint}/token/${address}/${tokenId}`
  }

  tokenId =
    tokenId && Number(tokenId) >= 0 && Number(tokenId) < Number.MAX_SAFE_INTEGER
      ? `${Number(tokenId)}`
      : tokenId

  return tokenId
    ? `${endpoint}/${type}/${address}/${tokenId}`
    : `${endpoint}/${type}/${address}`
}
