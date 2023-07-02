import { NETWORK } from 'palm-core/consts'
import { UTIL } from 'palm-core/libs'
import {
  AddEthereumChainParameter,
  NetworkTypeEnum,
  SupportedNetworkEnum,
} from 'palm-core/types'

export const chainId = (selectedNetwork: SupportedNetworkEnum): number => {
  const ret =
    NETWORK.chainIds[
      UTIL.isMainnet() ? NetworkTypeEnum.MAINNET : NetworkTypeEnum.TESTNET
    ][selectedNetwork]
  return ret
}

export const chainParam = (
  selectedNetwork: SupportedNetworkEnum
): AddEthereumChainParameter => {
  const ret =
    NETWORK.chainParams[
      UTIL.isMainnet() ? NetworkTypeEnum.MAINNET : NetworkTypeEnum.TESTNET
    ][selectedNetwork]
  return ret
}
