import {
  Attribute,
  Maybe,
  Profile,
  ProfileMedia,
  Scalars,
} from 'graphqls/__generated__/graphql'
import { ContractAddr } from './contracts'
import { SendbirdUser } from '@sendbird/uikit-utils'

export type User = {
  address: ContractAddr
  accessToken?: string
  sbUser?: SendbirdUser
  lensProfile?: Profile
  /** Optionals param to add extra attributes on the metadata */
  attributes?: Maybe<Array<Attribute>>
  /** Bio of the profile */
  bio?: Maybe<Scalars['String']>
  /** The cover picture for the profile */
  coverPicture?: Maybe<ProfileMedia>
  /** The profile handle */
  handle?: Scalars['Handle']
  /** The picture for the profile */
  picture?: Maybe<ProfileMedia>
}
