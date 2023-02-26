import {
  getInternetCredentials,
  setInternetCredentials,
} from 'react-native-keychain'
import { KeyChainEnum } from 'types'

export const savePkey = async (
  privateKey: string,
  pKeyPwd: string
): Promise<void> => {
  await setInternetCredentials(KeyChainEnum.PK, KeyChainEnum.PK, privateKey)
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

export const getPkeyPwd = async (): Promise<string> => {
  const res = await getInternetCredentials(KeyChainEnum.PK_PWD)
  if (res) {
    return res.password
  }
  return ''
}
