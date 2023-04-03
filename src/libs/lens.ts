import { Profile } from '@lens-protocol/react-native-lens-ui-kit/dist/graphql/generated'
import { fixIpfsURL } from './ipfs'
import { User } from 'types'
import { AttributeData } from '@lens-protocol/react-native-lens-ui-kit'
import { Attribute } from 'graphqls/__generated__/graphql'

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

export const getAttributesData = (
  profile: User | Profile | undefined
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
