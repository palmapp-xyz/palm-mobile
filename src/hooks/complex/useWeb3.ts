import Web3 from 'web3'
import { Account } from 'web3-core'
import { useMemo } from 'react'

import { NETWORK } from 'consts'
import useSetting from 'hooks/independent/useSetting'
import { getPkey } from 'libs/account'
import { ChainNetworkEnum, SupportedNetworkEnum } from 'types'
import { isMainnet } from 'libs/utils'

type UseWeb3Return = {
  web3: Web3
  getSigner: () => Promise<Account | undefined>
}

const useWeb3 = (chain: SupportedNetworkEnum): UseWeb3Return => {
  const { setting } = useSetting()
  const mainnet = isMainnet(setting.network)

  const web3 = useMemo(
    () =>
      new Web3(
        NETWORK.chainParam[
          chain === SupportedNetworkEnum.KLAYTN
            ? mainnet
              ? ChainNetworkEnum.CYPRESS
              : ChainNetworkEnum.BAOBAB
            : chain === SupportedNetworkEnum.POLYGON
            ? mainnet
              ? ChainNetworkEnum.POLYGON
              : ChainNetworkEnum.MUMBAI
            : mainnet
            ? ChainNetworkEnum.ETHEREUM
            : ChainNetworkEnum.GOERLI
        ].rpcUrls[0]
      ),
    [mainnet]
  )

  const getSigner = async (): Promise<Account | undefined> => {
    const pKey = await getPkey()
    if (pKey) {
      return web3.eth.accounts.privateKeyToAccount(pKey)
    }
  }

  return {
    web3,
    getSigner,
  }
}

export default useWeb3
