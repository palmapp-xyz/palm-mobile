import { Profile } from 'palm-core/graphqls/__generated__/graphql'
import { ContractAddr, FbProfile } from 'palm-core/types'

import { getProfileMediaImg } from './lens'

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

  const firstCoverPicture: string | undefined = isLensProfile(first)
    ? getProfileMediaImg(first.coverPicture)
    : first.coverPicture
  const secondCoverPicture: string | undefined = isLensProfile(second)
    ? getProfileMediaImg(second.coverPicture)
    : second.coverPicture

  return (
    first.handle === second.handle &&
    first.name === second.name &&
    first.bio === second.bio &&
    getProfileMediaImg(first.picture) === getProfileMediaImg(second.picture) &&
    firstCoverPicture === secondCoverPicture &&
    JSON.stringify(first.attributes) === JSON.stringify(second.attributes)
  )
}

export const isLensProfile = (x: FbProfile | Profile): x is Profile => {
  return (x as Profile).__typename !== undefined
}
