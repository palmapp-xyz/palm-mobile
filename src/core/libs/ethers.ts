import { NETWORK } from 'core/consts'
import { UTIL } from 'core/libs'
import { ChainNetworkEnum, SupportedNetworkEnum } from 'core/types'
import { TypedDataDomain, Wallet, ethers } from 'ethers'
import _ from 'lodash'
import PkeyManager from 'reactnative/app/pkeyManager'

const mainnet = UTIL.isMainnet()

export const ethersProviders = {
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
}

export const getSigner = async (
  chain: SupportedNetworkEnum
): Promise<Wallet | undefined> => {
  const pKey = await PkeyManager.getPkey()
  if (!pKey) {
    return undefined
  }
  return new Wallet(pKey, ethersProviders[chain])
}

export const signedTypeData = async (
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
