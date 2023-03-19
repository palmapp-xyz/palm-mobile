import { useMemo } from 'react'
import { Config } from 'react-native-config'
import {
  AddEthereumChainParameter,
  ContractMap,
  SupportedNetworkEnum,
} from 'types'
import { ADDRESS_MAP, NETWORK } from 'consts'
import useSetting from 'hooks/independent/useSetting'

const useNetwork = (): {
  apiPath: string
  contractMap: ContractMap
  connectedNetworkIds: Record<SupportedNetworkEnum, number>
  connectedNetworkParams: Record<
    SupportedNetworkEnum,
    AddEthereumChainParameter
  >
} => {
  const { setting } = useSetting()

  const apiPath = Config.OEDI_API || ''

  const contractMap = useMemo(() => {
    return ADDRESS_MAP.contractMap[setting.network]
  }, [setting.network])

  const connectedNetworkIds = useMemo(() => {
    return NETWORK.chainIds[setting.network]
  }, [setting.network])
  const connectedNetworkParams = useMemo(
    () => NETWORK.chainParams[setting.network],
    [setting.network]
  )

  return {
    apiPath,
    contractMap,
    connectedNetworkIds,
    connectedNetworkParams,
  }
}

export default useNetwork
