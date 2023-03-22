import {
  TransactionReceipt,
  UpdateProfileImageRequest,
} from 'graphqls/__generated__/graphql'
import useLens from './useLens'
import useLensProfile from './useLensProfile'
import useAuth from 'hooks/independent/useAuth'

export type UseLensReturn = {
  updateProfileImage: ({
    profileId,
    url,
  }: {
    profileId: string
    url: string
  }) => Promise<void>
}

const useUpdateLensProfileImage = (): UseLensReturn => {
  const {
    pollUntilIndexed,
    signCreateSetProfileImageUriTypedData,
    createSetProfileUriViaDispatcherRequest,
    broadcastRequest,
  } = useLens()

  const { user } = useAuth()
  const { profile, refetch } = useLensProfile({
    userAddress: user?.address,
  })

  const setProfileImage = async (
    createProfileImageRequest: UpdateProfileImageRequest
  ): Promise<{
    txHash: any
    txId: any
  }> => {
    // this means it they have not setup the dispatcher, if its a no you must use broadcast
    if (profile?.dispatcher?.canUseRelay) {
      const dispatcherResult = await createSetProfileUriViaDispatcherRequest(
        createProfileImageRequest
      )
      console.log(
        'set profile image url via dispatcher: createPostViaDispatcherRequest',
        dispatcherResult
      )

      if (dispatcherResult.__typename !== 'RelayerResult') {
        console.error(
          'set profile image url via dispatcher: failed',
          dispatcherResult
        )
        throw new Error('set profile image url via dispatcher: failed')
      }

      return { txHash: dispatcherResult.txHash, txId: dispatcherResult.txId }
    } else {
      const signedResult = await signCreateSetProfileImageUriTypedData(
        createProfileImageRequest
      )
      console.log(
        'set profile image url via broadcast: signedResult',
        signedResult
      )

      const broadcastResult = await broadcastRequest({
        id: signedResult.result.id,
        signature: signedResult.signature,
      })

      if (broadcastResult.__typename !== 'RelayerResult') {
        console.error(
          'set profile image url via broadcast: failed',
          broadcastResult
        )
        throw new Error('set profile image url via broadcast: failed')
      }

      console.log(
        'set profile image url via broadcast: broadcastResult',
        broadcastResult
      )
      return { txHash: broadcastResult.txHash, txId: broadcastResult.txId }
    }
  }

  const updateProfileImage = async ({
    profileId,
    url,
  }: {
    profileId: string
    url: string
  }): Promise<void> => {
    // hard coded to make the code example clear
    const setProfileImageUriRequest = {
      profileId,
      url,
    }

    const result = await setProfileImage(setProfileImageUriRequest)
    console.log('set profile image url gasless', result)

    console.log('set profile image url: poll until indexed')
    const indexedResult = await pollUntilIndexed({ txId: result.txId })

    const logs =
      indexedResult.txReceipt &&
      'logs' in indexedResult?.txReceipt &&
      (indexedResult.txReceipt as TransactionReceipt).logs
    refetch()

    console.log('create profile metadata: logs', logs)
    console.log('set profile image url: profile has been indexed', result)
  }

  return {
    updateProfileImage,
  }
}

export default useUpdateLensProfileImage
