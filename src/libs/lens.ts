import { fixIpfsURL } from './ipfs'
import { AttributeData } from '@lens-protocol/react-native-lens-ui-kit'
import { Maybe } from '@toruslabs/openlogin'
import {
  Attribute,
  Profile,
  ProfileMedia,
} from 'graphqls/__generated__/graphql'

export const getProfileMediaImg = (profile?: {
  picture?: Maybe<ProfileMedia>
}): string | undefined => {
  if (!profile) {
    return undefined
  }
  const profileImg =
    profile.picture?.__typename === 'MediaSet'
      ? fixIpfsURL(profile.picture.original?.url)
      : profile.picture?.__typename === 'NftImage'
      ? fixIpfsURL(profile.picture.uri)
      : undefined
  return profileImg
}

export const getAttributesData = (
  profile: Profile | undefined
): AttributeData[] => {
  return (
    profile?.attributes?.map(
      (attr: Attribute) =>
        ({
          displayType: attr.displayType || undefined,
          key: attr.key,
          traitType: attr.traitType || undefined,
          value: attr.value,
        } as AttributeData)
    ) || []
  )
}
