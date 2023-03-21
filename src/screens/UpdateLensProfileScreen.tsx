import React, { ReactElement, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import { COLOR } from 'consts'
import { Container, FormButton, Header } from 'components'
import useLens from 'hooks/lens/useLens'
import useAuth from 'hooks/independent/useAuth'
import useLensProfile from 'hooks/lens/useLensProfile'

import {
  CreatePublicSetProfileMetadataUriRequest,
  TransactionReceipt,
} from 'graphqls/__generated__/graphql'
import { useAppNavigation } from 'hooks/useAppNavigation'

const UpdateLensProfileScreen = (): ReactElement => {
  const [isFetching, setIsFetching] = useState(false)

  const { navigation } = useAppNavigation()
  const { user } = useAuth()
  const {
    createSetProfileMetadataViaDispatcherRequest,
    signCreateSetProfileMetadataTypedData,
    broadcastRequest,
    pollUntilIndexed,
  } = useLens()

  const { profile, loading, refetch } = useLensProfile({
    userAddress: user?.address,
  })

  const setMetadata = async (
    createMetadataRequest: CreatePublicSetProfileMetadataUriRequest
  ): Promise<{
    txHash: any
    txId: any
  }> => {
    // this means it they have not setup the dispatcher, if its a no you must use broadcast
    if (profile?.dispatcher?.canUseRelay) {
      const dispatcherResult =
        await createSetProfileMetadataViaDispatcherRequest(
          createMetadataRequest
        )
      console.log(
        'create profile metadata via dispatcher: createPostViaDispatcherRequest',
        dispatcherResult
      )

      if (dispatcherResult.__typename !== 'RelayerResult') {
        console.error(
          'create profile metadata via dispatcher: failed',
          dispatcherResult
        )
        throw new Error('create profile metadata via dispatcher: failed')
      }

      return { txHash: dispatcherResult.txHash, txId: dispatcherResult.txId }
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
        console.error(
          'create profile metadata via broadcast: failed',
          broadcastResult
        )
        throw new Error('create profile metadata via broadcast: failed')
      }

      console.log(
        'create profile metadata via broadcast: broadcastResult',
        broadcastResult
      )
      return { txHash: broadcastResult.txHash, txId: broadcastResult.txId }
    }
  }

  const onClickConfirm = async (): Promise<void> => {
    setIsFetching(true)
    // hard coded to make the code example clear
    const createProfileMetadataRequest = {
      profileId: profile?.id,
      metadata:
        'https://lens.infura-ipfs.io/ipfs/QmPZufGcsXtnV4VKLD3bnUPh8ovzKhQgtgeDYptc2rWHmZ',
    }

    const result = await setMetadata(createProfileMetadataRequest)

    console.log('create comment gasless', result)

    console.log('create profile metadata: poll until indexed')
    const indexedResult = await pollUntilIndexed({ txId: result.txId })

    console.log('create profile metadata: profile has been indexed', result)

    const logs =
      indexedResult.txReceipt &&
      'logs' in indexedResult?.txReceipt &&
      (indexedResult.txReceipt as TransactionReceipt).logs

    console.log('create profile metadata: logs', logs)
    refetch()
    setIsFetching(false)
  }

  return (
    <Container style={styles.container}>
      <Header
        title="Update lens profile"
        left={
          <Icon name="ios-chevron-back" color={COLOR.gray._800} size={20} />
        }
        onPressLeft={navigation.goBack}
      />
      {loading ? (
        <View style={styles.body}>
          <ActivityIndicator size="large" color={COLOR.primary._100} />
        </View>
      ) : (
        <View style={styles.body}>
          <View style={{ paddingTop: 30, alignItems: 'center' }}>
            <Text style={styles.text}>{'Your lens Profile'}</Text>
          </View>
          <View
            style={{
              height: 400,
              overflow: 'scroll',
              backgroundColor: 'white',
            }}>
            <Text style={styles.text}>
              {JSON.stringify(
                {
                  bio: profile?.bio,
                  name: profile?.name,
                  attributes: profile?.attributes,
                },
                null,
                2
              )}
            </Text>
          </View>
          <FormButton disabled={isFetching || loading} onPress={onClickConfirm}>
            Update profile
          </FormButton>
        </View>
      )}
    </Container>
  )
}

export default UpdateLensProfileScreen

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: {
    flex: 1,
    gap: 20,
    padding: 10,
    justifyContent: 'space-between',
  },
  text: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
})
