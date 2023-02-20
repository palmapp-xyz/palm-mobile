import { useMemo } from 'react'

import { ContractMap } from 'types'
import { ADDRESS_MAP } from 'consts'
import useSetting from 'hooks/independent/useSetting'

const useNetwork = (): {
  apiPath: string
  contractMap: ContractMap
} => {
  const { setting } = useSetting()

  const contractMap = useMemo(() => {
    return ADDRESS_MAP.contractMap[setting.network]
  }, [setting.network])

  const apiPath = process.env.REACT_APP_OEDI_API || ''

  return {
    apiPath,
    contractMap,
  }
}

export default useNetwork
