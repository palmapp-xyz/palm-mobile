import { ADDRESS_MAP, NETWORK } from 'core/consts'
import { isMainnet } from 'core/libs/utils'
import {
  AddEthereumChainParameter,
  ContractMap,
  NetworkTypeEnum,
  SupportedNetworkEnum,
} from 'core/types'
import { useMemo } from 'react'
import { Config } from 'react-native-config'

const useNetwork = (): {
  apiPath: string
  contractMap: ContractMap
  connectedNetworkIds: Record<SupportedNetworkEnum, number>
  connectedNetworkParams: Record<
    SupportedNetworkEnum,
    AddEthereumChainParameter
  >
} => {
  const mainnet = isMainnet()

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
