import { gql } from '@apollo/client'
import { Profile as LensProfile } from '__generated__/graphql'

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

  export type Profile = {
    profile: LensProfile
  }

  export type DefaultProfile = {
    defaultProfile: LensProfile
  }
}
