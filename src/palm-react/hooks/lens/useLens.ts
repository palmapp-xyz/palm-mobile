import { utils } from 'ethers'
import _ from 'lodash'
import {
  AuthenticationResult,
  BroadcastDocument,
  BroadcastMutation,
  BroadcastRequest,
  CreateProfileDocument,
  CreateProfileMutation,
  CreateProfileRequest,
  CreatePublicSetProfileMetadataUriRequest,
  CreateSetProfileImageUriTypedDataDocument,
  CreateSetProfileMetadataTypedDataDocument,
  CreateSetProfileMetadataTypedDataMutation,
  CreateSetProfileMetadataViaDispatcherDocument,
  CreateSetProfileMetadataViaDispatcherMutation,
  DefaultProfileDocument,
  HasTxHashBeenIndexedDocument,
  HasTxHashBeenIndexedQuery,
  HasTxHashBeenIndexedRequest,
  NftOwnershipChallengeDocument,
  NftOwnershipChallengeRequest,
  NftOwnershipChallengeResult,
  PaginatedProfileResult,
  Profile,
  ProfileDocument,
  ProfileQueryRequest,
  ProfilesDocument,
  PublicationMetadataStatusType,
  TransactionReceipt,
  UpdateProfileImageRequest,
} from 'palm-core/graphqls/__generated__/graphql'
import { UTIL } from 'palm-core/libs'
import { recordError } from 'palm-core/libs/logger'
import {
  ContractAddr,
  PostTxStatus,
  SupportedNetworkEnum,
  TrueOrErrReturn,
} from 'palm-core/types'
import useEthers from 'palm-react/hooks/complex/useEthers'
import useIpfs from 'palm-react/hooks/complex/useIpfs'
import useNetwork from 'palm-react/hooks/complex/useNetwork'
import postTxStore from 'palm-react/store/postTxStore'
import { useSetRecoilState } from 'recoil'
import { v4 as uuidv4 } from 'uuid'

import {
  ApolloQueryResult,
  FetchResult,
  MutationOptions,
  OperationVariables,
  QueryOptions,
  useApolloClient,
} from '@apollo/client'
import { TransactionResponse } from '@ethersproject/providers'
import {
  Environment,
  ProfileMetadata,
} from '@lens-protocol/react-native-lens-ui-kit'

import useAuth from '../auth/useAuth'
import useLensAuth from './useLensAuth'
import useLensHub from './useLensHub'

export type UseLensReturn = {
  appId: string
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
    tokenId: string,
    chainId: SupportedNetworkEnum
  ) => Promise<TrueOrErrReturn<string>>
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
        },
    maxTimeout?: number
  ) => Promise<
    TrueOrErrReturn<HasTxHashBeenIndexedQuery['hasTxHashBeenIndexed']>
  >
  setMetadata: (
    profile: Profile,
    metadata: Partial<ProfileMetadata>
  ) => Promise<
    TrueOrErrReturn<{
      metadata: any
      txHash: any
      txId: any
    }>
  >
}

const useLens = (): UseLensReturn => {
  const { signedTypeData, getSigner: getEthersSigner } = useEthers()
  const { user, setLensAuth } = useAuth()
  const { query: aQuery, mutate: aMutate } = useApolloClient()
  const { uploadFolder } = useIpfs({})
  const setPostTxResult = useSetRecoilState(postTxStore.postTxResult)

  const { connectedNetworkIds } = useNetwork()
  const lensEnv = UTIL.isMainnet() ? Environment.mainnet : Environment.testnet

  const { lensHub } = useLensHub(SupportedNetworkEnum.POLYGON)

  const { refreshAuthIfExpired } = useLensAuth()

  const appId = `palm-${lensEnv}`

  const query = async <
    T = any,
    TVariables extends OperationVariables = OperationVariables
  >(
    options: QueryOptions<TVariables, T>
  ): Promise<ApolloQueryResult<T>> => {
    let lensAuth: AuthenticationResult | null | undefined
    if (user?.lensAuth) {
      lensAuth = await refreshAuthIfExpired(user.lensAuth).then(res => {
        if (res.success && res.value !== undefined) {
          // token refreshed
          return setLensAuth(res.value).then(() => {
            return res.value
          })
        }
      })
    }

    lensAuth = lensAuth ?? user?.lensAuth

    return await aQuery({
      context: {
        headers: {
          'x-access-token': lensAuth?.accessToken
            ? `Bearer ${lensAuth.accessToken}`
            : '',
        },
      },
      ...options,
    })
  }

  const mutate = async <
    TData = any,
    TVariables extends OperationVariables = OperationVariables
  >(
    options: MutationOptions<TData, TVariables>
  ): Promise<FetchResult<TData>> => {
    let lensAuth: AuthenticationResult | null | undefined
    if (user?.lensAuth) {
      lensAuth = await refreshAuthIfExpired(user.lensAuth).then(res => {
        if (res.success && res.value !== undefined) {
          // token refreshed
          return setLensAuth(res.value).then(() => {
            return res.value
          })
        }
      })
    }

    lensAuth = lensAuth ?? user?.lensAuth

    return await aMutate({
      context: {
        headers: {
          'x-access-token': lensAuth?.accessToken
            ? `Bearer ${lensAuth.accessToken}`
            : '',
        },
      },
      ...options,
    })
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
    tokenId: string,
    chainId: SupportedNetworkEnum
  ): Promise<TrueOrErrReturn<string>> => {
    const signer = await getEthersSigner(chainId)
    if (signer && lensHub) {
      try {
        setPostTxResult({
          status: PostTxStatus.POST,
          chain: chainId,
        })
        console.log(
          `setting profile image uri nft signer ${signer.address} contract ${contractAddress} tokenId ${tokenId} chainId ${connectedNetworkIds[chainId]}`
        )
        // prove ownership of the nft
        const challengeInfo = await nftOwnershipChallenge({
          ethereumAddress: signer.address,
          nfts: [
            {
              contractAddress,
              tokenId,
              chainId: connectedNetworkIds[chainId],
            },
          ],
        })

        console.log('nftOwnershipChallenge challengeInfo', challengeInfo)

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

        const tx: TransactionResponse = await lensHub.setProfileImageURIWithSig(
          {
            profileId: typedData.value.profileId,
            imageURI: typedData.value.imageURI,
            sig: {
              v,
              r,
              s,
              deadline: typedData.value.deadline,
            },
          },
          { gasLimit: 8000000, gasPrice: utils.parseUnits('90', 'gwei') }
        )
        console.log('set profile image uri normal: tx hash', tx.hash)

        setPostTxResult({
          status: PostTxStatus.BROADCAST,
          transactionHash: tx.hash!,
          chain: chainId,
        })

        const txReceipt = await tx.wait()
        setPostTxResult({
          status: PostTxStatus.DONE,
          value: txReceipt,
          chain: chainId,
        })

        return {
          success: true,
          value: tx.hash,
        }
      } catch (error) {
        setPostTxResult({
          status: PostTxStatus.ERROR,
          error,
          chain: chainId,
        })
        return { success: false, errMsg: _.toString(error) }
      }
    }

    return {
      success: false,
      errMsg: 'No user',
    }
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

  const processIndexedResult = async (
    response: HasTxHashBeenIndexedQuery['hasTxHashBeenIndexed']
  ): Promise<
    TrueOrErrReturn<HasTxHashBeenIndexedQuery['hasTxHashBeenIndexed']>
  > => {
    if (response.__typename === 'TransactionIndexedResult') {
      console.log('poll until indexed: indexed', response.indexed)
      console.log(
        'poll until metadataStatus: metadataStatus',
        response.metadataStatus
      )
      console.log(response.metadataStatus)
      if (response.metadataStatus) {
        if (response.metadataStatus.status === 'SUCCESS') {
          return { success: true, value: response }
        } else if (
          response.metadataStatus.status ===
          PublicationMetadataStatusType.MetadataValidationFailed
        ) {
          throw new Error(
            response.metadataStatus.reason || response.metadataStatus.status
          )
        } else {
          return {
            success: false,
            errMsg:
              response.metadataStatus.reason || response.metadataStatus.status,
          }
        }
      } else {
        if (response.indexed) {
          return { success: true, value: response }
        } else {
          return {
            success: false,
            errMsg: PublicationMetadataStatusType.NotFound,
          }
        }
      }
    } else {
      // it got reverted and failed!
      throw new Error(response.reason)
    }
  }

  const pollUntilIndexed = async (
    input: { txHash: string } | { txId: string },
    maxTimeout?: number
  ): Promise<
    TrueOrErrReturn<HasTxHashBeenIndexedQuery['hasTxHashBeenIndexed']>
  > => {
    const timeout = 1500
    let i = 0
    while (Number(maxTimeout) > 0 ? i * timeout < Number(maxTimeout) : true) {
      const response = await hasTxBeenIndexed(input)
      const res = await processIndexedResult(response)
      console.log('poll until indexed: result', response)

      if (res.success) {
        return res
      } else if (
        res.errMsg === PublicationMetadataStatusType.MetadataValidationFailed
      ) {
        throw new Error(res.errMsg)
      }

      i++
      console.log(
        `poll until indexed: sleeping for ${
          timeout * i
        } milliseconds then try again until ${maxTimeout}`
      )
      // sleep for a second before trying again
      await new Promise(resolve => setTimeout(resolve, timeout * i))
    }
    return { success: false, errMsg: PublicationMetadataStatusType.Pending }
  }

  const setMetadata = async (
    profile: Profile,
    update: Partial<ProfileMetadata>
  ): Promise<
    TrueOrErrReturn<{
      metadata: any
      txHash: any
      txId: any
    }>
  > => {
    try {
      const metadata_id = uuidv4()
      const profileMetadata: ProfileMetadata = {
        version: '1.0.0',
        metadata_id,
        appId,
        name: update.name || '',
        bio: update.bio || '',
        cover_picture: update.cover_picture || '',
        attributes: update.attributes ?? [],
      }
      const res = await uploadFolder([
        {
          path: `${appId}/${profile.ownedBy}/${metadata_id}.json`,
          content: profileMetadata,
        },
      ])
      console.log('uploadIpfs result:', res)
      if (!res.success) {
        throw new Error(res.errMsg)
      }
      const metadata = res.value?.[0].path
      console.log('set metadata:', metadata)

      const createMetadataRequest: CreatePublicSetProfileMetadataUriRequest = {
        profileId: profile.id,
        metadata,
      }
      let value: {
        metadata: any
        txHash: any
        txId: any
      } = { metadata, txHash: undefined, txId: undefined }
      // this means it they have not setup the dispatcher, if its a no you must use broadcast
      if (profile?.dispatcher?.canUseRelay) {
        const dispatcherResult =
          await createSetProfileMetadataViaDispatcherRequest(
            createMetadataRequest
          )
        console.log(
          'create profile metadata via dispatcher: createSetProfileMetadataViaDispatcherRequest',
          dispatcherResult
        )

        if (dispatcherResult.__typename !== 'RelayerResult') {
          const err: Error = new Error(JSON.stringify(dispatcherResult))
          recordError(err, 'setProfileMetadata:createDispatcherRequest')
          throw err
        }

        value = {
          txHash: dispatcherResult.txHash,
          txId: dispatcherResult.txId,
          metadata,
        }
      } else {
        const signedResult = await signCreateSetProfileMetadataTypedData(
          createMetadataRequest
        )
        console.log(
          'create profile metadata via broadcast: signedResult',
          signedResult
        )

        const broadcastResult = await broadcastRequest({
          id: signedResult.result.id,
          signature: signedResult.signature,
        })

        if (broadcastResult.__typename !== 'RelayerResult') {
          const err: Error = new Error(JSON.stringify(broadcastResult))

          recordError(err, 'setProfileMetadata:broadcastRequest')
          throw new Error('create profile metadata via broadcast: failed')
        }

        console.log(
          'create profile metadata via broadcast: broadcastResult',
          broadcastResult
        )
        value = {
          metadata,
          txHash: broadcastResult.txHash,
          txId: broadcastResult.txId,
        }
      }

      console.log('create comment gasless', value)

      console.log('create profile metadata: poll until indexed')
      const indexedResult = await pollUntilIndexed({ txId: value.txId }, 20000)

      console.log('create profile metadata: profile has been indexed', value)

      if (indexedResult.success) {
        const logs =
          indexedResult.value.txReceipt &&
          'logs' in indexedResult.value?.txReceipt &&
          (indexedResult.value.txReceipt as TransactionReceipt).logs

        console.log('create profile metadata: logs', logs)

        return {
          success: true,
          value,
        }
      } else {
        return indexedResult
      }
    } catch (error) {
      return { success: false, errMsg: _.toString(error) }
    }
  }

  return {
    appId,
    getProfiles,
    getProfile,
    getDefaultProfile,
    createProfile,
    nftOwnershipChallenge,
    updateProfileImage,
    createSetProfileMetadataViaDispatcherRequest,
    signCreateSetProfileMetadataTypedData,
    broadcastRequest,
    pollUntilIndexed,
    setMetadata,
  }
}

export default useLens
