import { Attribute, ProfileMedia } from 'palm-core/graphqls'
import { ContractAddr, DeviceTokenSet } from 'palm-core/types'

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
