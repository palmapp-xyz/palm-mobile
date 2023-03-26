import React, { ReactElement, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { useAlert } from '@sendbird/uikit-react-native-foundation'

import { Container, FormButton, FormInput } from 'components'
import useAuth from 'hooks/independent/useAuth'
import { COLOR } from 'consts'
import useFsProfile from 'hooks/firestore/useFsProfile'

const CreateProfileScreen = (): ReactElement => {
  const { user } = useAuth()

  const [isFetching, setIsFetching] = useState(false)
  const [handle, setHandle] = useState('')

  const {
    fsProfile,
    refetch,
    isFetching: loading,
  } = useFsProfile({
    address: user?.address,
  })

  const { alert } = useAlert()

  const onClickConfirm = async (): Promise<void> => {
    if (!fsProfile) {
      alert({
        message: `No profile exists for account address ${user?.address}`,
      })
      return
    }

    try {
      setIsFetching(true)
      await fsProfile.update({ handle })
      refetch()
    } catch (error) {
      console.error(
        'createProfile, onClickConfirm',
        JSON.stringify(error, null, 2)
      )
      alert({ message: JSON.stringify(error, null, 2) })
    }
    setIsFetching(false)
  }

  return (
    <Container style={styles.container}>
      {loading ? (
        <View style={[styles.body]}>
          <ActivityIndicator size="large" color={COLOR.primary._100} />
        </View>
      ) : (
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
          <FormButton disabled={isFetching || loading} onPress={onClickConfirm}>
            Create Profile
          </FormButton>
        </View>
      )}
    </Container>
  )
}

export default CreateProfileScreen

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
