import React, { ReactElement, useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useAlert } from '@sendbird/uikit-react-native-foundation'

import { Container, FormButton, FormInput } from 'components'
import useAuth from 'hooks/independent/useAuth'
import useFsProfile from 'hooks/firestore/useFsProfile'
import { useRecoilState } from 'recoil'
import appStore from 'store/appStore'

const CreateProfileScreen = (): ReactElement => {
  const { user } = useAuth()

  const [handle, setHandle] = useState('')

  const [loading, setLoading] = useRecoilState(appStore.loading)

  const { fsProfile, fsProfileField, refetch } = useFsProfile({
    address: user?.address,
  })

  const { alert } = useAlert()

  const onClickConfirm = async (): Promise<void> => {
    if (!fsProfile) {
      return
    }

    try {
      setLoading(true)
      await fsProfile.update({ handle })
      await refetch()
    } catch (error) {
      console.error(
        'createProfile, onClickConfirm',
        JSON.stringify(error, null, 2)
      )
      alert({ message: JSON.stringify(error, null, 2) })
    }
  }

  useEffect(() => {
    if (fsProfileField?.handle) {
      setLoading(false)
    }
  }, [fsProfileField])

  return (
    <Container style={styles.container}>
      <View style={styles.body}>
        <View style={{ paddingTop: 30, alignItems: 'center' }}>
          <Text style={styles.text}>
            {!fsProfileField
              ? 'Checking for your profile'
              : 'Create your profile'}
          </Text>
        </View>
        {fsProfileField && !fsProfileField.handle && (
          <View>
            <Text style={styles.text}>Choose Username:</Text>
            <FormInput
              value={handle}
              onChangeText={setHandle}
              textContentType="username"
            />
            <FormButton disabled={loading} onPress={onClickConfirm}>
              Create Profile
            </FormButton>
          </View>
        )}
      </View>
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
