import { ADDRESS_MAP, NETWORK } from 'palm-core/consts'
import { UTIL } from 'palm-core/libs'
import {
  AddEthereumChainParameter,
  NetworkContractMap,
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

export const contractMap = (
  selectedNetwork: SupportedNetworkEnum
): NetworkContractMap => {
  const ret =
    ADDRESS_MAP.contractMap[
      UTIL.isMainnet() ? NetworkTypeEnum.MAINNET : NetworkTypeEnum.TESTNET
    ][selectedNetwork]
  return ret
}
