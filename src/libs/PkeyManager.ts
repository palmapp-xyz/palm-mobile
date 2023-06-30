import { validateMnemonic } from 'bip39'
import { PKeyManagerInterface } from 'core/libs/account'
import { KeyChainEnum } from 'core/types'
import { utils, Wallet } from 'ethers'
import { mnemonicToSeed } from 'ethers/lib/utils'
import {
  getInternetCredentials,
  resetInternetCredentials,
  setInternetCredentials,
} from 'react-native-keychain'

class PKeyManager implements PKeyManagerInterface {
  async saveMnemonic(mnemonic: string): Promise<void> {
    if (validateMnemonic(mnemonic) === false) {
      throw new Error('Invalid mnemonic')
    }
    await setInternetCredentials(
      KeyChainEnum.MNEMONIC,
      KeyChainEnum.MNEMONIC,
      mnemonic
    )
  }

  async savePkey(privateKey: string): Promise<void> {
    await setInternetCredentials(KeyChainEnum.PK, KeyChainEnum.PK, privateKey)
  }

  async savePkeyPwd(pKeyPwd: string): Promise<void> {
    await setInternetCredentials(
      KeyChainEnum.PK_PWD,
      KeyChainEnum.PK_PWD,
      pKeyPwd
    )
  }

  async getPkey(): Promise<string> {
    const res = await getInternetCredentials(KeyChainEnum.PK)
    if (res) {
      return res.password
    }
    return ''
  }

  async getMnemonic(): Promise<string> {
    const res = await getInternetCredentials(KeyChainEnum.MNEMONIC)
    if (res) {
      return res.password
    }
    return ''
  }

  async getPkeyPwd(): Promise<string> {
    const res = await getInternetCredentials(KeyChainEnum.PK_PWD)
    if (res) {
      return res.password
    }
    return ''
  }

  async removeKeys(): Promise<void> {
    await Promise.all([
      resetInternetCredentials(KeyChainEnum.PK),
      resetInternetCredentials(KeyChainEnum.PK_PWD),
      resetInternetCredentials(KeyChainEnum.MNEMONIC),
    ])
  }

  generateEvmHdAccount(mnemonic: string): Wallet {
    const derivationPath = "m/44'/60'/0'/0/0"
    const seed = mnemonicToSeed(mnemonic)
    const hdNode = utils.HDNode.fromSeed(seed)
    const derivedHdNode = hdNode.derivePath(derivationPath)

    return new Wallet(derivedHdNode)
  }
}

export default new PKeyManager()
