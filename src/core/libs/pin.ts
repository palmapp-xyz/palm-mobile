import { KeyChainEnum } from 'core/types'
import {
  getInternetCredentials,
  resetInternetCredentials,
  setInternetCredentials,
} from 'react-native-keychain'

export const savePin = async (pin: string): Promise<void> => {
  await setInternetCredentials(KeyChainEnum.PIN, KeyChainEnum.PIN, pin)
}

export const saveNewPin = async (pin: string): Promise<void> => {
  await setInternetCredentials(KeyChainEnum.NEW_PIN, KeyChainEnum.NEW_PIN, pin)
}

export const getPin = async (): Promise<string> => {
  const res = await getInternetCredentials(KeyChainEnum.PIN)

  return res ? res.password : ''
}

export const getNewPin = async (): Promise<string> => {
  const res = await getInternetCredentials(KeyChainEnum.NEW_PIN)

  return res ? res.password : ''
}

export const resetPin = async (): Promise<void> => {
  await resetInternetCredentials(KeyChainEnum.PIN)
}

export const resetNewPin = async (): Promise<void> => {
  await resetInternetCredentials(KeyChainEnum.NEW_PIN)
}
