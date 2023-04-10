import { Profile } from 'graphqls/__generated__/graphql'
import { ContractAddr } from './contracts'
import { SendbirdUser } from '@sendbird/uikit-utils'

export type User = Partial<Profile> & {
  address: ContractAddr
  profileId: string
  lensAccessToken?: string
  sbUser?: SendbirdUser
  lensProfile?: Profile
  auth?: AuthChallengeResult
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
}
