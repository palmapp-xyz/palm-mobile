import React, { ReactElement, useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useAlert } from '@sendbird/uikit-react-native-foundation'

import { Container, FormButton, FormInput } from 'components'
import useAuth from 'hooks/auth/useAuth'
import { useRecoilState } from 'recoil'
import appStore from 'store/appStore'
import useProfile from 'hooks/auth/useProfile'
import { isMainnet } from 'libs/utils'

const CreateProfileScreen = (): ReactElement => {
  const { user } = useAuth()
  const [handle, setHandle] = useState('')
  const [loading, setLoading] = useRecoilState(appStore.loading)
  const { profile, createProfile } = useProfile({
    profileId: user?.auth?.profileId,
  })
  const { alert } = useAlert()
  const testnet = !isMainnet()

  const onClickConfirm = async (): Promise<void> => {
    if (!profile) {
      return
    }

    setLoading(true)
    setTimeout(() => {
      createProfile(handle, testnet)
        .then(res => {
          if (!res.success) {
            console.error('createProfile:onClickConfirm', res.errMsg)
            alert({ message: res.errMsg })
          }
        })
        .catch(error => {
          console.error(
            'createProfile:onClickConfirm',
            JSON.stringify(error, null, 2)
          )
          alert({ message: JSON.stringify(error) })
        })
        .finally(() => setLoading(false))
    }, 300)
  }

  useEffect(() => {
    if (profile?.handle) {
      setLoading(false)
    }
  }, [profile])

  return (
    <Container style={styles.container}>
      <View style={styles.body}>
        <View style={{ paddingTop: 30, alignItems: 'center' }}>
          <Text style={[styles.text, { fontWeight: 'bold' }]}>
            {!profile || profile.handle
              ? `Checking for your ${testnet ? 'Lens ' : ''}profile`
              : `Create your ${testnet ? 'Lens ' : ''}profile`}
          </Text>
        </View>
        {profile && !profile.handle && (
          <View>
            <Text style={styles.text}>Choose a unique handle:</Text>
            <FormInput
              value={handle}
              onChangeText={setHandle}
              textContentType="username"
              style={{ marginVertical: 20 }}
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
