import { AuthenticationResult } from 'graphqls/__generated__/graphql'

import { FirebaseAuthTypes } from '@react-native-firebase/auth'

import { ContractAddr } from './contracts'

export type DeviceToken = {
  apns: string[]
  fcm: string[]
}

export type User = {
  address: ContractAddr
  lensAuth?: AuthenticationResult | null // if null, not a lens user
  auth?: AuthChallengeResult
  userCredential?: FirebaseAuthTypes.UserCredential
}

export type AuthChallengeInfo = {
  id: string
  message: string
  profileId: string
}

export type AuthChallengeResult = {
  id: string
  domain: string
  chainId: string
  address: string
  statement?: string
  uri: string
  expirationTime?: string
  notBefore?: string
  version: string
  nonce: string
  profileId: string
  authToken: string
}

export type JwtToken = {
  id: string
  role: string
  iat: number
  exp: number
}
