import { Attribute, ProfileMedia } from 'graphqls/__generated__/graphql'
import { DeviceToken } from 'types/auth'
import { ContractAddr } from 'types/contracts'

export type FbProfile = {
  address: ContractAddr
  profileId: string
  verified: boolean
  bio?: string
  coverPicture?: string
  attributes?: Array<Attribute>
  handle?: string
  picture?: ProfileMedia
  deviceTokens?: DeviceToken[]
}
