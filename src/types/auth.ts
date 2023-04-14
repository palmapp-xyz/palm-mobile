import { AuthenticationResult, Profile } from 'graphqls/__generated__/graphql'
import { ContractAddr } from './contracts'
import { SendbirdUser } from '@sendbird/uikit-utils'
import { FirebaseAuthTypes } from '@react-native-firebase/auth'

export type User = Partial<Profile> & {
  address: ContractAddr
  profileId: string
  lensAuth?: AuthenticationResult | null // if null, not a lens user
  sbUser?: SendbirdUser
  lensProfile?: Profile
  auth?: AuthChallengeResult
  userCredential?: FirebaseAuthTypes.UserCredential
  verified: boolean
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
