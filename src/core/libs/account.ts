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
}
