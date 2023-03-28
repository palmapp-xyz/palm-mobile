import React, { ReactElement, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { useAlert } from '@sendbird/uikit-react-native-foundation'

import { Container, FormButton, FormInput } from 'components'
import useLens from 'hooks/lens/useLens'
import useAuth from 'hooks/independent/useAuth'
import useLensProfile from 'hooks/lens/useLensProfile'
import { COLOR } from 'consts'
import Spinner from 'react-native-loading-spinner-overlay'

const CreateLensProfileScreen = (): ReactElement => {
  const { user } = useAuth()
  const { createProfile } = useLens()

  const [isFetching, setIsFetching] = useState(false)
  const [handle, setHandle] = useState('')

  const { refetch, loading: lensProfileFetchLoading } = useLensProfile({
    userAddress: user?.address,
  })

  const { alert } = useAlert()

  const onClickConfirm = async (): Promise<void> => {
    setIsFetching(true)
    setTimeout(async () => {
      try {
        const res = await createProfile({
          handle,
        })

        if (res.success) {
          await refetch()
        } else {
          throw new Error(res.errMsg)
        }
      } catch (error) {
        console.error(
          'createProfile, onClickConfirm',
          JSON.stringify(error, null, 2)
        )
        alert({ message: JSON.stringify(error, null, 2) })
      } finally {
        setIsFetching(false)
      }
    }, 500)
  }

  return (
    <Container style={styles.container}>
      <Spinner
        visible={isFetching || lensProfileFetchLoading}
        textContent={'Loading...'}
        textStyle={{ color: COLOR.gray._300, fontSize: 16 }}
      />
      <View style={styles.body}>
        <View style={{ paddingTop: 30, alignItems: 'center' }}>
          <Text style={styles.text}>{"You don't have any lens Profile"}</Text>
        </View>
        <Text style={styles.text}>Choose Username:</Text>
        <FormInput
          value={handle}
          onChangeText={setHandle}
          textContentType="username"
        />
        <FormButton
          disabled={!handle || isFetching || lensProfileFetchLoading}
          onPress={onClickConfirm}>
          Mint Profile NFT
        </FormButton>
      </View>
    </Container>
  )
}

export default CreateLensProfileScreen

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  body: {
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
