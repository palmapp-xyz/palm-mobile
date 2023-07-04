import { ethers, TypedDataDomain, Wallet } from 'ethers'
import _ from 'lodash'
import { NETWORK } from 'palm-core/consts'
import { UTIL } from 'palm-core/libs'
import { ChainNetworkEnum, SupportedNetworkEnum } from 'palm-core/types'
import PkeyManager from 'palm-react-native/app/pkeyManager'
import { useCallback, useMemo } from 'react'

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
  const mainnet = UTIL.isMainnet()

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
      const pKey = await PkeyManager.getPkey()
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
      const pKey = await PkeyManager.getPkey()
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
