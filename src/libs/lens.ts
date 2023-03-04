import { gql } from '@apollo/client'

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
}
