import { Maybe } from '@toruslabs/openlogin'
import _ from 'lodash'
import { User } from 'types'

// returns boolean whether `second` user fields are all equally included in `first` user fields
// undefined if first and second inputs are not of the same address
export const profilesDeepCompare = (
  first: Maybe<User>,
  second: Maybe<User>
): boolean | undefined => {
  if (
    first === null ||
    first === undefined ||
    second === null ||
    second === undefined ||
    (first.address || first.ownedBy) !== (second.address || second.ownedBy)
  ) {
    return undefined
  }

  const firstSerialized = JSON.stringify(_.pick(first, Object.keys(second)))
  const secondSerialized = JSON.stringify(second)

  // console.log(
  //   '[profilesDeepCompare]\n - ',
  //   firstSerialized,
  //   '\n - ',
  //   secondSerialized,
  //   `\n : firstSerialized === secondSerialized ${
  //     firstSerialized === secondSerialized
  //   }`
  // )

  return firstSerialized === secondSerialized
}
