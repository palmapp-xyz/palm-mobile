import { utils, Wallet } from 'ethers'
import { mnemonicToSeed } from 'ethers/lib/utils'
import {
  getInternetCredentials,
  resetInternetCredentials,
  setInternetCredentials,
} from 'react-native-keychain'
import { KeyChainEnum } from 'types'

export const savePkey = async (privateKey: string): Promise<void> => {
  await setInternetCredentials(KeyChainEnum.PK, KeyChainEnum.PK, privateKey)
}

export const savePkeyPwd = async (pKeyPwd: string): Promise<void> => {
  await setInternetCredentials(
    KeyChainEnum.PK_PWD,
    KeyChainEnum.PK_PWD,
    pKeyPwd
  )
}

export const getPkey = async (): Promise<string> => {
  const res = await getInternetCredentials(KeyChainEnum.PK)
  if (res) {
    return res.password
  }
  return ''
}

export const removeKeys = async (): Promise<void> => {
  await resetInternetCredentials(KeyChainEnum.PK)
  await resetInternetCredentials(KeyChainEnum.PK_PWD)
}

export const getPkeyPwd = async (): Promise<string> => {
  const res = await getInternetCredentials(KeyChainEnum.PK_PWD)
  if (res) {
    return res.password
  }
  return ''
}

export const generateEvmHdAccount = async (
  mnemonic: string
): Promise<Wallet> => {
  const derivationPath = "m/44'/60'/0'/0/0"
  const seed = mnemonicToSeed(mnemonic)
  const hdNode = utils.HDNode.fromSeed(seed)
  const derivedHdNode = hdNode.derivePath(derivationPath)

  return new Wallet(derivedHdNode)
}
