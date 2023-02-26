import { useMemo } from 'react'
import { Config } from 'react-native-config'
import { AddEthereumChainParameter, ContractMap } from 'types'
import { ADDRESS_MAP, NETWORK } from 'consts'
import useSetting from 'hooks/independent/useSetting'

const useNetwork = (): {
  apiPath: string
  contractMap: ContractMap
  connectedNetworkId: number
  connectedNetworkParam: AddEthereumChainParameter
} => {
  const { setting } = useSetting()

  const apiPath = Config.OEDI_API || ''

  const contractMap = useMemo(() => {
    return ADDRESS_MAP.contractMap[setting.network]
  }, [setting.network])

  const connectedNetworkId = useMemo(
    () => NETWORK.chainId[setting.network],
    [setting.network]
  )
  const connectedNetworkParam = useMemo(
    () => NETWORK.chainParam[setting.network],
    [setting.network]
  )

  return {
    apiPath,
    contractMap,
    connectedNetworkId,
    connectedNetworkParam,
  }
}

export default useNetwork
