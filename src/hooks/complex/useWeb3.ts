import Web3 from 'web3'
import { Account } from 'web3-core'
import { useMemo } from 'react'

import { NETWORK } from 'consts'
import useSetting from 'hooks/independent/useSetting'
import useReactQuery from './useReactQuery'
import { getPkey } from 'libs/account'

type UseWeb3Return = {
  web3: Web3
  signer?: Account
}

const useWeb3 = (): UseWeb3Return => {
  const { setting } = useSetting()
  const web3 = useMemo(() => {
    const ep = NETWORK.chainParam[setting.network].rpcUrls[0]
    return new Web3(ep)
  }, [setting.network])

  const { data: signer } = useReactQuery(['Signer'], async () => {
    const pKey = await getPkey()
    if (pKey) {
      return web3.eth.accounts.privateKeyToAccount(pKey)
    }
  })

  return {
    web3,
    signer,
  }
}

export default useWeb3
