import { Profile } from '@lens-protocol/react-native-lens-ui-kit/dist/graphql/generated'
import { fixIpfsURL } from './ipfs'

export const getProfileImgFromLensProfile = async (
  profile: Profile | undefined
): Promise<string | undefined> => {
  if (!profile) {
    return
  }
  const profileImg =
    profile.picture?.__typename === 'MediaSet'
      ? fixIpfsURL(profile.picture.original.url)
      : profile.picture?.__typename === 'NftImage'
      ? fixIpfsURL(profile.picture.uri)
      : undefined
  return profileImg
}
