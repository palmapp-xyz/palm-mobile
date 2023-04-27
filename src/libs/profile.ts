import { Profile } from 'graphqls/__generated__/graphql'
import _ from 'lodash'
import { ContractAddr, FbProfile } from 'types'
import { getProfileImgFromLensProfile } from './lens'

// returns boolean whether `second` user fields are all equally included in `first` user fields
// undefined if first and second inputs are not of the same address
export const profilesDeepCompare = (
  first: FbProfile | Profile,
  second: FbProfile | Profile
): boolean | undefined => {
  const firstAddress: ContractAddr = isLensProfile(first)
    ? (first.ownedBy as ContractAddr)
    : first.address
  const secondAddress: ContractAddr = isLensProfile(second)
    ? (second.ownedBy as ContractAddr)
    : second.address

  if (firstAddress !== secondAddress) {
    return undefined
  }

  const firstProfileImg: string | undefined = isLensProfile(first)
    ? getProfileImgFromLensProfile(first)
    : first.profileImg
  const secondProfileImg: string | undefined = isLensProfile(second)
    ? getProfileImgFromLensProfile(second)
    : second.profileImg

  return (
    first.handle === second.handle &&
    first.bio === second.bio &&
    firstProfileImg === secondProfileImg
  )
}

export const isLensProfile = (x: FbProfile | Profile): x is Profile => {
  return (x as Profile).__typename !== undefined
}
