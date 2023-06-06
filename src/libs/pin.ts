import {
  getInternetCredentials,
  resetInternetCredentials,
  setInternetCredentials,
} from 'react-native-keychain'
import { KeyChainEnum } from 'types'

export const savePin = async (pin: string): Promise<void> => {
  await setInternetCredentials(KeyChainEnum.PIN, KeyChainEnum.PIN, pin)
}

export const getPin = async (): Promise<string> => {
  const res = await getInternetCredentials(KeyChainEnum.PIN)

  return res ? res.password : ''
}

export const resetPin = async (): Promise<void> => {
  await resetInternetCredentials(KeyChainEnum.PIN)
}
