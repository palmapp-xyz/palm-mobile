import 'react-native-get-random-values'
import Web3 from 'web3'
import { useMemo } from 'react'

import { NETWORK } from 'consts'
import useSetting from 'hooks/independent/useSetting'

type UseWeb3Return = {
  web3: Web3
}

const useWeb3 = (): UseWeb3Return => {
  const { setting } = useSetting()
  const web3 = useMemo(() => {
    const ep = NETWORK.chainParam[setting.network].rpcUrls[0]
    return new Web3(ep)
  }, [setting.network])

  return {
    web3,
  }
}

export default useWeb3
