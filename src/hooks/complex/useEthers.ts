import { useCallback, useMemo } from 'react'

import { NETWORK } from 'consts'
import useSetting from 'hooks/independent/useSetting'
import { getPkey } from 'libs/account'
import { ChainNetworkEnum, SupportedNetworkEnum } from 'types'
import { isMainnet } from 'libs/utils'
import { TypedDataDomain, Wallet, ethers } from 'ethers'
import _ from 'lodash'

type UseEthersReturn = {
  providers: Record<SupportedNetworkEnum, ethers.providers.JsonRpcProvider>
  getSigner: (chain: SupportedNetworkEnum) => Promise<Wallet | undefined>
  signedTypeData: (
    chain: SupportedNetworkEnum,
    domain: TypedDataDomain,
    types: Record<string, any>,
    value: Record<string, any>
  ) => Promise<string | undefined>
}

const useEthers = (): UseEthersReturn => {
  const { setting } = useSetting()
  const mainnet = isMainnet(setting.network)

  const { providers } = useMemo(
    () => ({
      providers: {
        [SupportedNetworkEnum.ETHEREUM]: new ethers.providers.JsonRpcProvider(
          NETWORK.chainParam[
            mainnet ? ChainNetworkEnum.ETHEREUM : ChainNetworkEnum.GOERLI
          ].rpcUrls[0]
        ),
        [SupportedNetworkEnum.KLAYTN]: new ethers.providers.JsonRpcProvider(
          NETWORK.chainParam[
            mainnet ? ChainNetworkEnum.CYPRESS : ChainNetworkEnum.BAOBAB
          ].rpcUrls[0]
        ),
        [SupportedNetworkEnum.POLYGON]: new ethers.providers.JsonRpcProvider(
          NETWORK.chainParam[
            mainnet ? ChainNetworkEnum.POLYGON : ChainNetworkEnum.MUMBAI
          ].rpcUrls[0]
        ),
      },
    }),
    [mainnet]
  )

  const getSigner = useCallback(
    async (chain: SupportedNetworkEnum) => {
      const pKey = await getPkey()
      if (!pKey) {
        return undefined
      }
      return new Wallet(pKey, providers[chain])
    },
    [mainnet]
  )

  const signedTypeData = useCallback(
    async (
      chain: SupportedNetworkEnum,
      domain: TypedDataDomain,
      types: Record<string, any>,
      value: Record<string, any>
    ): Promise<string | undefined> => {
      const pKey = await getPkey()
      const signer = new Wallet(pKey, providers[chain])
      if (!signer) {
        return undefined
      }
      // remove the __typedname from the signature!
      return signer?._signTypedData(
        _.omit(domain, '__typename'),
        _.omit(types, '__typename'),
        _.omit(value, '__typename')
      )
    },
    [mainnet]
  )

  return {
    providers,
    getSigner,
    signedTypeData,
  }
}

export default useEthers