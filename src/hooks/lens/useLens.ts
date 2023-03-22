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
import { SupportedNetworkEnum, TrueOrErrReturn } from 'types'
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
  CreatePublicSetProfileMetadataUriRequest,
  CreateSetProfileMetadataViaDispatcherDocument,
  CreateSetProfileMetadataViaDispatcherMutation,
  CreateSetProfileMetadataTypedDataDocument,
  CreateSetProfileMetadataTypedDataMutation,
  BroadcastDocument,
  BroadcastMutation,
  BroadcastRequest,
  HasTxHashBeenIndexedDocument,
  HasTxHashBeenIndexedQuery,
  HasTxHashBeenIndexedRequest,
  CreateSetProfileImageUriTypedDataMutation,
  CreateSetProfileImageUriViaDispatcherDocument,
  CreateSetProfileImageUriViaDispatcherMutation,
} from 'graphqls/__generated__/graphql'
import useAuth from '../independent/useAuth'
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
  createSetProfileMetadataViaDispatcherRequest: (
    request: CreatePublicSetProfileMetadataUriRequest
  ) => Promise<
    CreateSetProfileMetadataViaDispatcherMutation['createSetProfileMetadataViaDispatcher']
  >
  signCreateSetProfileMetadataTypedData: (
    request: CreatePublicSetProfileMetadataUriRequest
  ) => Promise<{
    result: CreateSetProfileMetadataTypedDataMutation['createSetProfileMetadataTypedData']
    signature?: string | undefined
  }>
  broadcastRequest: (
    request: BroadcastRequest
  ) => Promise<BroadcastMutation['broadcast']>
  pollUntilIndexed: (
    input:
      | {
          txHash: string
        }
      | {
          txId: string
        }
  ) => Promise<HasTxHashBeenIndexedQuery['hasTxHashBeenIndexed']>
  createSetProfileImageURITypedData: (
    request: UpdateProfileImageRequest
  ) => Promise<
    | CreateSetProfileImageUriTypedDataMutation['createSetProfileImageURITypedData']
    | undefined
  >
  signCreateSetProfileImageUriTypedData: (
    request: UpdateProfileImageRequest
  ) => Promise<{
    result: CreateSetProfileImageUriTypedDataMutation['createSetProfileImageURITypedData']
    signature?: string | undefined
  }>
  createSetProfileUriViaDispatcherRequest: (
    request: UpdateProfileImageRequest
  ) => Promise<
    CreateSetProfileImageUriViaDispatcherMutation['createSetProfileImageURIViaDispatcher']
  >
}

const useLens = (): UseLensReturn => {
  const { getSigner } = useWeb3()
  const { signedTypeData } = useEthers()
  const { user } = useAuth()
  const { query: aQuery, mutate: aMutate } = useApolloClient()

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

  const createSetProfileImageURITypedData = async (
    request: UpdateProfileImageRequest
  ): Promise<
    | CreateSetProfileImageUriTypedDataMutation['createSetProfileImageURITypedData']
    | undefined
  > => {
    const fetchRes = await mutate({
      mutation: CreateSetProfileImageUriTypedDataDocument,
      variables: { request },
      refetchQueries: [{ query: ProfilesDocument }, { query: ProfileDocument }],
    })
    return fetchRes.data?.createSetProfileImageURITypedData
  }

  const createSetProfileMetadataViaDispatcherRequest = async (
    request: CreatePublicSetProfileMetadataUriRequest
  ): Promise<
    CreateSetProfileMetadataViaDispatcherMutation['createSetProfileMetadataViaDispatcher']
  > => {
    const result = await mutate({
      mutation: CreateSetProfileMetadataViaDispatcherDocument,
      variables: {
        request,
      },
    })

    return result.data!.createSetProfileMetadataViaDispatcher
  }

  const createSetProfileMetadataTypedData = async (
    request: CreatePublicSetProfileMetadataUriRequest
  ): Promise<
    CreateSetProfileMetadataTypedDataMutation['createSetProfileMetadataTypedData']
  > => {
    const result = await mutate({
      mutation: CreateSetProfileMetadataTypedDataDocument,
      variables: {
        request,
      },
    })

    return result.data!.createSetProfileMetadataTypedData
  }

  const signCreateSetProfileMetadataTypedData = async (
    request: CreatePublicSetProfileMetadataUriRequest
  ): Promise<{
    result: CreateSetProfileMetadataTypedDataMutation['createSetProfileMetadataTypedData']
    signature?: string
  }> => {
    const result = await createSetProfileMetadataTypedData(request)
    console.log('create profile metadata: createCommentTypedData', result)

    const typedData = result.typedData
    console.log('create profile metadata: typedData', typedData)

    const signature = await signedTypeData(
      SupportedNetworkEnum.POLYGON,
      typedData.domain,
      typedData.types,
      typedData.value
    )
    console.log('create profile metadata: signature', signature)

    return { result, signature }
  }

  const broadcastRequest = async (
    request: BroadcastRequest
  ): Promise<BroadcastMutation['broadcast']> => {
    const result = await mutate({
      mutation: BroadcastDocument,
      variables: {
        request,
      },
    })

    return result.data!.broadcast
  }

  const hasTxBeenIndexed = async (
    request: HasTxHashBeenIndexedRequest
  ): Promise<HasTxHashBeenIndexedQuery['hasTxHashBeenIndexed']> => {
    const result = await query({
      query: HasTxHashBeenIndexedDocument,
      variables: {
        request,
      },
      fetchPolicy: 'network-only',
    })

    return result.data.hasTxHashBeenIndexed
  }

  const pollUntilIndexed = async (
    input: { txHash: string } | { txId: string }
  ): Promise<HasTxHashBeenIndexedQuery['hasTxHashBeenIndexed']> => {
    while (true) {
      const response = await hasTxBeenIndexed(input)
      console.log('pool until indexed: result', response)

      if (response.__typename === 'TransactionIndexedResult') {
        console.log('pool until indexed: indexed', response.indexed)
        console.log(
          'pool until metadataStatus: metadataStatus',
          response.metadataStatus
        )

        console.log(response.metadataStatus)
        if (response.metadataStatus) {
          if (response.metadataStatus.status === 'SUCCESS') {
            return response
          }

          if (response.metadataStatus.status === 'METADATA_VALIDATION_FAILED') {
            throw new Error(response.metadataStatus.status)
          }
        } else {
          if (response.indexed) {
            return response
          }
        }

        console.log(
          'pool until indexed: sleep for 1500 milliseconds then try again'
        )
        // sleep for a second before trying again
        await new Promise(resolve => setTimeout(resolve, 1500))
      } else {
        // it got reverted and failed!
        throw new Error(response.reason)
      }
    }
  }
  const createSetProfileImageUriTypedData = async (
    request: UpdateProfileImageRequest
  ): Promise<
    CreateSetProfileImageUriTypedDataMutation['createSetProfileImageURITypedData']
  > => {
    const result = await mutate({
      mutation: CreateSetProfileImageUriTypedDataDocument,
      variables: {
        request,
      },
    })

    return result.data!.createSetProfileImageURITypedData
  }

  const signCreateSetProfileImageUriTypedData = async (
    request: UpdateProfileImageRequest
  ): Promise<{
    result: CreateSetProfileImageUriTypedDataMutation['createSetProfileImageURITypedData']
    signature?: string
  }> => {
    const result = await createSetProfileImageUriTypedData(request)
    console.log(
      'set profile image uri: createSetProfileImageUriTypedData',
      result
    )

    const typedData = result.typedData
    console.log('set profile image uri: typedData', typedData)

    const signature = await signedTypeData(
      SupportedNetworkEnum.POLYGON,
      typedData.domain,
      typedData.types,
      typedData.value
    )
    console.log('set profile image uri: signature', signature)

    return { result, signature }
  }

  const createSetProfileUriViaDispatcherRequest = async (
    request: UpdateProfileImageRequest
  ): Promise<
    CreateSetProfileImageUriViaDispatcherMutation['createSetProfileImageURIViaDispatcher']
  > => {
    const result = await mutate({
      mutation: CreateSetProfileImageUriViaDispatcherDocument,
      variables: {
        request,
      },
    })

    return result.data!.createSetProfileImageURIViaDispatcher
  }

  return {
    sign,
    getProfiles,
    getProfile,
    getDefaultProfile,
    createProfile,
    nftOwnershipChallenge,
    createSetProfileMetadataViaDispatcherRequest,
    signCreateSetProfileMetadataTypedData,
    broadcastRequest,
    pollUntilIndexed,
    createSetProfileImageURITypedData,
    signCreateSetProfileImageUriTypedData,
    createSetProfileUriViaDispatcherRequest,
  }
}

export default useLens
