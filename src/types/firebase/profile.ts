import { Maybe } from '@toruslabs/openlogin'
import { ProfileMedia } from 'graphqls/__generated__/graphql'
import { DeviceToken } from 'types/auth'
import { ContractAddr } from 'types/contracts'

export type FbProfile = {
  address: ContractAddr
  profileId: string
  verified: boolean
  bio?: string
  handle?: string
  picture?: Maybe<ProfileMedia>
  deviceTokens?: DeviceToken[]
}
