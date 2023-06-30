import Config from 'config'
import { ADDRESS_MAP, NETWORK } from 'core/consts'
import { UTIL } from 'core/libs'
import {
  AddEthereumChainParameter,
  ContractMap,
  NetworkTypeEnum,
  SupportedNetworkEnum,
} from 'core/types'
import { useMemo } from 'react'

const useNetwork = (): {
  apiPath: string
  contractMap: ContractMap
  connectedNetworkIds: Record<SupportedNetworkEnum, number>
  connectedNetworkParams: Record<
    SupportedNetworkEnum,
    AddEthereumChainParameter
  >
} => {
  const mainnet = UTIL.isMainnet()

  const apiPath = Config.OEDI_API || ''

  const contractMap = useMemo(() => {
    return ADDRESS_MAP.contractMap[
      mainnet ? NetworkTypeEnum.MAINNET : NetworkTypeEnum.TESTNET
    ]
  }, [])

  const connectedNetworkIds = useMemo(() => {
    return NETWORK.chainIds[
      mainnet ? NetworkTypeEnum.MAINNET : NetworkTypeEnum.TESTNET
    ]
  }, [])
  const connectedNetworkParams = useMemo(
    () =>
      NETWORK.chainParams[
        mainnet ? NetworkTypeEnum.MAINNET : NetworkTypeEnum.TESTNET
      ],
    []
  )

  return {
    apiPath,
    contractMap,
    connectedNetworkIds,
    connectedNetworkParams,
  }
}

export default useNetwork
