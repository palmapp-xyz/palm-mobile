import { Attribute, ProfileMedia } from 'graphqls/__generated__/graphql'
import { ContractAddr, DeviceTokenSet } from 'types'

export type FbProfile = {
  address: ContractAddr
  profileId: string
  verified: boolean
  name?: string
  bio?: string
  coverPicture?: string
  attributes?: Array<Attribute>
  handle?: string
  picture?: ProfileMedia
  deviceTokens?: DeviceTokenSet
}
