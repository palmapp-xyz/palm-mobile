import { NETWORK } from 'core/consts'
import {
  AddEthereumChainParameter,
  NetworkTypeEnum,
  SupportedNetworkEnum,
} from 'core/types'

import { UTIL } from './'

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
