import { Profile } from '@lens-protocol/react-native-lens-ui-kit/dist/graphql/generated'
import { fixIpfsURL } from './ipfs'
import { User } from 'types'

export const getProfileImgFromProfile = (
  profile: Profile | User | undefined
): string | undefined => {
  if (!profile) {
    return undefined
  }
  const profileImg =
    profile.picture?.__typename === 'MediaSet'
      ? fixIpfsURL(profile.picture.original.url)
      : profile.picture?.__typename === 'NftImage'
      ? fixIpfsURL(profile.picture.uri)
      : undefined
  return profileImg
}
