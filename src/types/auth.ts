import { Profile } from 'graphqls/__generated__/graphql'
import { ContractAddr } from './contracts'
import { SendbirdUser } from '@sendbird/uikit-utils'

export type User = Partial<Profile> & {
  address: ContractAddr
  accessToken?: string
  sbUser?: SendbirdUser
  lensProfile?: Profile
}
