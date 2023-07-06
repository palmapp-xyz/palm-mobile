import { Wallet } from 'ethers'

export interface PKeyManagerInterface {
  saveMnemonic: (mnemonic: string) => Promise<void>

  savePkey: (privateKey: string) => Promise<void>

  savePkeyPwd: (pKeyPwd: string) => Promise<void>

  getPkey: () => Promise<string>

  getMnemonic: () => Promise<string>

  removeKeys: () => Promise<void>

  getPkeyPwd: () => Promise<string>

  generateEvmHdAccount: (mnemonic: string) => Wallet

  savePin: (pin: string) => Promise<void>

  saveNewPin: (pin: string) => Promise<void>

  getPin: () => Promise<string>

  getNewPin: () => Promise<string>

  resetPin: () => Promise<void>

  resetNewPin: () => Promise<void>
}
