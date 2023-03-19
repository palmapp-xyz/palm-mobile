import Web3 from 'web3'
import { Account } from 'web3-core'
import { useMemo } from 'react'

import { NETWORK } from 'consts'
import useSetting from 'hooks/independent/useSetting'
import { getPkey } from 'libs/account'
import { ChainNetworkEnum } from 'types'
import { isMainnet } from 'libs/utils'

type UseWeb3Return = {
  web3Eth: Web3
  web3Klaytn: Web3
  web3Polygon: Web3
  getSigner: () => Promise<Account | undefined>
}

const useWeb3 = (): UseWeb3Return => {
  const { setting } = useSetting()
  const mainnet = isMainnet(setting.network)

  const { web3Eth, web3Klaytn, web3Polygon } = useMemo(
    () => ({
      web3Eth: new Web3(
        NETWORK.chainParam[
          mainnet ? ChainNetworkEnum.ETHEREUM : ChainNetworkEnum.GOERLI
        ].rpcUrls[0]
      ),
      web3Klaytn: new Web3(
        NETWORK.chainParam[
          mainnet ? ChainNetworkEnum.CYPRESS : ChainNetworkEnum.BAOBAB
        ].rpcUrls[0]
      ),
      web3Polygon: new Web3(
        NETWORK.chainParam[
          mainnet ? ChainNetworkEnum.POLYGON : ChainNetworkEnum.MUMBAI
        ].rpcUrls[0]
      ),
    }),
    [mainnet]
  )

  const getSigner = async (): Promise<Account | undefined> => {
    const pKey = await getPkey()
    if (pKey) {
      return web3Eth.eth.accounts.privateKeyToAccount(pKey)
    }
  }

  return {
    web3Eth,
    web3Klaytn,
    web3Polygon,
    getSigner,
  }
}

export default useWeb3
