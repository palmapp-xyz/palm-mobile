import { Account } from 'web3-core'
import {
  ApolloQueryResult,
  FetchResult,
  MutationOptions,
  OperationVariables,
  QueryOptions,
  useApolloClient,
} from '@apollo/client'

import useWeb3 from 'hooks/complex/useWeb3'
import { ContractAddr, SupportedNetworkEnum, TrueOrErrReturn } from 'types'
import {
  AuthenticateDocument,
  ChallengeDocument,
  CreateProfileDocument,
  CreateProfileMutation,
  CreateProfileRequest,
  NftOwnershipChallengeDocument,
  NftOwnershipChallengeResult,
  DefaultProfileDocument,
  PaginatedProfileResult,
  ProfileDocument,
  ProfileQueryRequest,
  ProfilesDocument,
  NftOwnershipChallengeRequest,
  CreateSetProfileImageUriTypedDataDocument,
  Profile,
  UpdateProfileImageRequest,
} from 'graphqls/__generated__/graphql'
import useAuth from '../independent/useAuth'
import useNetwork from 'hooks/complex/useNetwork'
import { utils } from 'ethers'
import useLensHub from './useLensHub'
import useEthers from 'hooks/complex/useEthers'

export type UseLensReturn = {
  signer?: Account
  sign: () => Promise<TrueOrErrReturn>
  getProfiles: (request: ProfileQueryRequest) => Promise<PaginatedProfileResult>
  getProfile: (profileId: string) => Promise<Profile | undefined>
  getDefaultProfile: (address: string) => Promise<Profile | undefined>
  createProfile: (
    request: CreateProfileRequest
  ) => Promise<TrueOrErrReturn<CreateProfileMutation['createProfile']>>
  nftOwnershipChallenge: (
    request: NftOwnershipChallengeRequest
  ) => Promise<NftOwnershipChallengeResult>
  updateProfileImage: (
    profileId: string,
    contractAddress: ContractAddr,
    tokenId: string
  ) => Promise<TrueOrErrReturn<string>>
}

const useLens = (): UseLensReturn => {
  const { getSigner } = useWeb3()
  const { signedTypeData, getSigner: getEthersSigner } = useEthers()
  const { user } = useAuth()
  const { query: aQuery, mutate: aMutate } = useApolloClient()
  const { connectedNetworkIds } = useNetwork()
  const connectedNetworkId = connectedNetworkIds[SupportedNetworkEnum.POLYGON]
  const { lensHub } = useLensHub(SupportedNetworkEnum.POLYGON)

  const query = <
    T = any,
    TVariables extends OperationVariables = OperationVariables
  >(
    options: QueryOptions<TVariables, T>
  ): Promise<ApolloQueryResult<T>> =>
    aQuery({
      context: {
        headers: {
          'x-access-token': user?.accessToken
            ? `Bearer ${user.accessToken}`
            : '',
        },
      },
      ...options,
    })

  const mutate = <
    TData = any,
    TVariables extends OperationVariables = OperationVariables
  >(
    options: MutationOptions<TData, TVariables>
  ): Promise<FetchResult<TData>> =>
    aMutate({
      context: {
        headers: {
          'x-access-token': user?.accessToken
            ? `Bearer ${user.accessToken}`
            : '',
        },
      },
      ...options,
    })

  const sign = async (): Promise<TrueOrErrReturn> => {
    const signer = await getSigner()
    if (signer) {
      try {
        /* first request the challenge from the API server */
        const challengeInfo = await query({
          query: ChallengeDocument,
          variables: {
            request: { address: signer.address },
          },
        })

        /* ask the user to sign a message with the challenge info returned from the server */
        const signature = signer.sign(
          challengeInfo.data.challenge.text
        ).signature

        /* authenticate the user */
        const authData = await mutate({
          mutation: AuthenticateDocument,
          variables: {
            request: {
              address: signer.address,
              signature,
            },
          },
        })

        /* if user authentication is successful, you will receive an accessToken and refreshToken */
        if (authData.data?.authenticate.accessToken) {
          return {
            success: true,
            value: authData.data.authenticate.accessToken,
          }
        }
      } catch (error) {
        return { success: false, errMsg: JSON.stringify(error, null, 2) }
      }
    }
    return { success: false, errMsg: 'No user' }
  }

  const getProfiles = async (
    request: ProfileQueryRequest
  ): Promise<PaginatedProfileResult> => {
    const fetchRes = await query({
      query: ProfilesDocument,
      variables: { request },
      fetchPolicy: 'no-cache',
    })
    return fetchRes.data.profiles as PaginatedProfileResult
  }

  const getProfile = async (
    profileId: string
  ): Promise<Profile | undefined> => {
    const fetchRes = await query({
      query: ProfileDocument,
      variables: { request: { profileId } },
    })
    return fetchRes.data.profile as Profile
  }

  const getDefaultProfile = async (
    address: string
  ): Promise<Profile | undefined> => {
    const fetchRes = await query({
      query: DefaultProfileDocument,
      variables: { request: { ethereumAddress: address } },
    })

    return fetchRes.data.defaultProfile as Profile
  }

  const createProfile = async (
    request: CreateProfileRequest
  ): Promise<TrueOrErrReturn<CreateProfileMutation['createProfile']>> => {
    const fetchRes = await mutate({
      mutation: CreateProfileDocument,
      variables: { request },
      refetchQueries: [{ query: ProfilesDocument }, { query: ProfileDocument }],
    })

    /* if user authentication is successful, you will receive an accessToken and refreshToken */
    if (fetchRes.data?.createProfile.__typename === 'RelayerResult') {
      return {
        success: true,
        value: fetchRes.data?.createProfile,
      }
    } else {
      return {
        success: false,
        errMsg:
          fetchRes.data?.createProfile?.reason ||
          'Failed to create Lens profile',
      }
    }
  }

  const nftOwnershipChallenge = async (
    request: NftOwnershipChallengeRequest
  ): Promise<NftOwnershipChallengeResult> => {
    const fetchRes = await query({
      query: NftOwnershipChallengeDocument,
      variables: { request },
    })
    return fetchRes.data.nftOwnershipChallenge as NftOwnershipChallengeResult
  }

  const updateProfileImage = async (
    profileId: string,
    contractAddress: ContractAddr,
    tokenId: string
  ): Promise<TrueOrErrReturn<string>> => {
    const signer = await getEthersSigner(SupportedNetworkEnum.POLYGON)
    if (signer) {
      try {
        // prove ownership of the nft
        const challengeInfo = await nftOwnershipChallenge({
          ethereumAddress: signer.address,
          nfts: [
            {
              contractAddress,
              tokenId,
              chainId: connectedNetworkId,
            },
          ],
        })

        // sign the text with the wallet
        /* ask the user to sign a message with the challenge info returned from the server */
        const challengeSignature = await signer.signMessage(challengeInfo.text)

        const request: UpdateProfileImageRequest = {
          profileId,
          nftData: {
            id: challengeInfo.id,
            signature: challengeSignature,
          },
        }

        const result = await mutate({
          mutation: CreateSetProfileImageUriTypedDataDocument,
          variables: { request },
          refetchQueries: [
            { query: ProfilesDocument },
            { query: ProfileDocument },
          ],
        })

        const typedData =
          result.data!.createSetProfileImageURITypedData!.typedData
        console.log('set profile image uri nft: typedData', typedData)

        const signature = await signedTypeData(
          SupportedNetworkEnum.POLYGON,
          typedData.domain,
          typedData.types,
          typedData.value
        )
        console.log('set profile image uri nft: signature', signature)

        const { v, r, s } = utils.splitSignature(signature!)

        const tx = await lensHub!.setProfileImageURIWithSig({
          profileId: typedData.value.profileId,
          imageURI: typedData.value.imageURI,
          sig: {
            v,
            r,
            s,
            deadline: typedData.value.deadline,
          },
        })
        console.log('set profile image uri normal: tx hash', tx.hash)

        return {
          success: true,
          value: tx.hash,
        }
      } catch (error) {
        return { success: false, errMsg: JSON.stringify(error, null, 2) }
      }
    }

    return {
      success: false,
      errMsg: 'No user',
    }
  }

  return {
    sign,
    getProfiles,
    getProfile,
    getDefaultProfile,
    createProfile,
    nftOwnershipChallenge,
    updateProfileImage,
  }
}

export default useLens
