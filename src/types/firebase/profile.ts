import { DeviceToken } from 'types/auth'
import { ContractAddr } from 'types/contracts'

export type FbProfile = {
  address: ContractAddr
  profileId: string
  verified: boolean
  bio?: string
  handle?: string
  profileImg?: string
  deviceTokens?: DeviceToken[]
}
