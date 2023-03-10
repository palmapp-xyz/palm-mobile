import { gql } from '@apollo/client'
import { ExtendedProfile } from '@lens-protocol/react-native-lens-ui-kit'
import { ContractAddr } from 'types'
import { fetchNftImage } from './fetchTokenUri'
import { fixIpfsURL } from './ipfs'

export namespace lens {
  export const challenge = gql`
    query Challenge($address: EthereumAddress!) {
      challenge(request: { address: $address }) {
        text
      }
    }
  `

  export const authenticate = gql`
    mutation Authenticate($address: EthereumAddress!, $signature: Signature!) {
      authenticate(request: { address: $address, signature: $signature }) {
        accessToken
        refreshToken
      }
    }
  `

  export const follow = gql`
    mutation CreateFollowTypedData {
      createFollowTypedData(
        request: { follow: [{ profile: "0x01", followModule: null }] }
      ) {
        id
        expiresAt
        typedData {
          domain {
            name
            chainId
            version
            verifyingContract
          }
          types {
            FollowWithSig {
              name
              type
            }
          }
          value {
            nonce
            deadline
            profileIds
            datas
          }
        }
      }
    }
  `

  export const profile = gql`
    query Profile {
      profile(request: { profileId: "0x01" }) {
        id
        name
        bio
        attributes {
          displayType
          traitType
          key
          value
        }
        followNftAddress
        metadata
        isDefault
        picture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
          __typename
        }
        handle
        coverPicture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
          __typename
        }
        ownedBy
        dispatcher {
          address
          canUseRelay
        }
        stats {
          totalFollowers
          totalFollowing
          totalPosts
          totalComments
          totalMirrors
          totalPublications
          totalCollects
        }
        followModule {
          ... on FeeFollowModuleSettings {
            type
            amount {
              asset {
                symbol
                name
                decimals
                address
              }
              value
            }
            recipient
          }
          ... on ProfileFollowModuleSettings {
            type
          }
          ... on RevertFollowModuleSettings {
            type
          }
        }
      }
    }
  `

  export const defaultProfile = gql`
    query DefaultProfile($address: EthereumAddress!) {
      defaultProfile(request: { ethereumAddress: $address }) {
        id
        name
        bio
        isDefault
        attributes {
          displayType
          traitType
          key
          value
        }
        followNftAddress
        metadata
        handle
        picture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            chainId
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
        }
        coverPicture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            chainId
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
        }
        ownedBy
        dispatcher {
          address
          canUseRelay
        }
        stats {
          totalFollowers
          totalFollowing
          totalPosts
          totalComments
          totalMirrors
          totalPublications
          totalCollects
        }
        followModule {
          ... on FeeFollowModuleSettings {
            type
            contractAddress
            amount {
              asset {
                name
                symbol
                decimals
                address
              }
              value
            }
            recipient
          }
          ... on ProfileFollowModuleSettings {
            type
          }
          ... on RevertFollowModuleSettings {
            type
          }
        }
      }
    }
  `
}

export namespace lensResponse {
  export type Profile = {
    profile: {
      attributes: any[]
      bio: string
      coverPicture: object[]
      // dispatcher: null
      // followModule: null
      followNftAddress: ContractAddr
      handle: string
      id: string
      isDefault: boolean
      metadata: string
      name: string
      ownedBy: ContractAddr
      picture: object[]
      stats: object[]
    }
  }

  export type DefaultProfile = {
    defaultProfile: {
      id: string
      name?: string
      bio?: string
      isDefault: boolean
      attributes: []
      followNftAddress: ContractAddr
      metadata?: string
      handle: string
      picture: {
        original: {
          url: string
          mimeType?: string
        }
      }
      coverPicture?: string
      ownedBy: ContractAddr
      // dispatcher: null
      stats: {
        totalFollowers: number
        totalFollowing: number
        totalPosts: number
        totalComments: number
        totalMirrors: number
        totalPublications: number
        totalCollects: number
      }
      // followModule: null
    }
  }
}

export const getProfileImgFromLensProfile = async (
  profile: ExtendedProfile
): Promise<string | undefined> => {
  const profileImg =
    profile.picture?.__typename === 'MediaSet'
      ? fixIpfsURL(profile.picture.original.url)
      : profile.picture?.__typename === 'NftImage'
      ? await fetchNftImage({ tokenUri: profile.picture.uri })
      : undefined
  return profileImg
}
