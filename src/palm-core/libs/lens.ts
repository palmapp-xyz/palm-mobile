import {
  Attribute,
  ProfileMedia,
} from 'palm-core/graphqls/__generated__/graphql'
import { AttributeData } from 'palm-core/types/lens'

import { Maybe } from '@toruslabs/openlogin'

import { fixTokenUri } from './ipfs'

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
  profile: { attributes?: Attribute[] | null } | undefined
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
