import { fixTokenUri } from './ipfs'
import { AttributeData } from '@lens-protocol/react-native-lens-ui-kit'
import { Maybe } from '@toruslabs/openlogin'
import {
  Attribute,
  Profile,
  ProfileMedia,
} from 'graphqls/__generated__/graphql'

export const getProfileMediaImg = (
  picture: Maybe<ProfileMedia>
): string | undefined => {
  if (!picture) {
    return undefined
  }
  const url =
    picture?.__typename === 'MediaSet'
      ? fixTokenUri(picture.original?.url)
      : picture?.__typename === 'NftImage'
      ? fixTokenUri(picture.uri)
      : undefined
  return url
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
