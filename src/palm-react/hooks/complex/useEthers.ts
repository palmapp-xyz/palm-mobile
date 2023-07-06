import { ethers, TypedDataDomain, Wallet } from 'ethers'
import _ from 'lodash'
import { ethersProviders } from 'palm-core/libs/ethers'
import { SupportedNetworkEnum } from 'palm-core/types'
import PkeyManager from 'palm-react-native/app/pkeyManager'

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
  const getSigner = async (
    chain: SupportedNetworkEnum
  ): Promise<ethers.Wallet | undefined> => {
    const pKey = await PkeyManager.getPkey()
    if (!pKey) {
      return undefined
    }
    return new Wallet(pKey, ethersProviders[chain])
  }

  const signedTypeData = async (
    chain: SupportedNetworkEnum,
    domain: TypedDataDomain,
    types: Record<string, any>,
    value: Record<string, any>
  ): Promise<string | undefined> => {
    const pKey = await PkeyManager.getPkey()
    const signer = new Wallet(pKey, ethersProviders[chain])
    if (!signer) {
      return undefined
    }
    // remove the __typedname from the signature!
    return signer?._signTypedData(
      _.omit(domain, '__typename'),
      _.omit(types, '__typename'),
      _.omit(value, '__typename')
    )
  }

  return {
    providers: ethersProviders,
    getSigner,
    signedTypeData,
  }
}

export default useEthers
