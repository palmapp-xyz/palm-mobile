import { Profile } from '@lens-protocol/react-native-lens-ui-kit/dist/graphql/generated'
import { Maybe } from '@toruslabs/openlogin'
import { User } from 'types'

// returns boolean whether the lens profile has been changed and the firestore profile needs to be updated
export const checkForProfileUpdate = (
  fsProfile: Maybe<User>,
  lensProfile: Maybe<Profile>
): boolean | undefined => {
  if (
    fsProfile === null ||
    fsProfile === undefined ||
    lensProfile === null ||
    lensProfile === undefined ||
    fsProfile.address !== lensProfile.ownedBy
  ) {
    return undefined
  }

  return JSON.stringify(fsProfile.lensProfile) !== JSON.stringify(lensProfile)
}
