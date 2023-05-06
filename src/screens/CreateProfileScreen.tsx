import {
  Container,
  FormButton,
  FormInput,
  FormText,
  Header,
  Row,
} from 'components'
import LoadingPage from 'components/atoms/LoadingPage'
import { COLOR } from 'consts'
import useAuth from 'hooks/auth/useAuth'
import useProfile from 'hooks/auth/useProfile'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { recordError } from 'libs/logger'
import { isMainnet } from 'libs/utils'
import React, { ReactElement, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useRecoilState } from 'recoil'
import appStore from 'store/appStore'

import { useAlert } from '@sendbird/uikit-react-native-foundation'

const CreateProfileScreen = (): ReactElement => {
  const { navigation } = useAppNavigation()

  const { user } = useAuth()
  const [handle, setHandle] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useRecoilState(appStore.loading)
  const { profile, createProfile } = useProfile({
    profileId: user?.auth?.profileId,
  })
  const { alert } = useAlert()
  const testnet = !isMainnet()

  const maxBioLength = 300

  const onClickConfirm = async (): Promise<void> => {
    if (!profile) {
      return
    }

    setLoading(true)
    setTimeout(() => {
      createProfile(handle, bio, testnet)
        .then(res => {
          if (!res.success) {
            recordError(new Error(res.errMsg), 'createProfile:onClickConfirm')
            alert({ message: res.errMsg })
          }
        })
        .catch(error => {
          recordError(error, 'createProfile:onClickConfirm')
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

  if (loading || !profile || profile.handle) {
    return <LoadingPage />
  }

  return (
    <Container style={styles.container}>
      <Header left="back" onPressLeft={navigation.goBack} />

      <View style={styles.body}>
        <View style={{ rowGap: 8, paddingBottom: 40 }}>
          <FormText fontType="B.24" style={{ fontWeight: 'bold' }}>
            {'Fill out your profile'}
          </FormText>
          <FormText color={COLOR.black._400} fontType="R.14">
            {'Please write a nice phrase\nthat describes you well'}
          </FormText>
        </View>
        <View style={{ rowGap: 12 }}>
          <View style={styles.rowSection}>
            <FormText fontType="R.12">Username</FormText>
            <FormInput
              value={handle}
              onChangeText={setHandle}
              textContentType="username"
              fontType="R.12"
              placeholder="Enter your nickname"
              autoCapitalize="none"
              style={{ marginVertical: 2 }}
            />
            <FormText fontType="R.12" color={COLOR.yellow}>
              Up to 20 characters are allowed, and only uppercase and lowercase
              letters and numbers can be entered.
            </FormText>
          </View>
          <View style={styles.rowSection}>
            <Row>
              <FormText fontType="R.12">Description</FormText>
              <FormText fontType="R.12">
                ({bio.length}/{maxBioLength})
              </FormText>
            </Row>
            <FormInput
              value={bio}
              onChangeText={(text: string): void => {
                if (text.length <= maxBioLength) {
                  setBio(text)
                }
              }}
              fontType="R.12"
              multiline={true}
              maxLength={maxBioLength}
              placeholder="Please write something you would like to introduce about yourself."
              style={{ marginVertical: 2, minHeight: 200 }}
            />
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <FormButton size="lg" disabled={loading} onPress={onClickConfirm}>
          Done
        </FormButton>
      </View>
    </Container>
  )
}

export default CreateProfileScreen

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { flex: 1, paddingHorizontal: 20, paddingVertical: 12 },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLOR.black._90010,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  seedItem: {
    flex: 1,
    columnGap: 4,
    alignItems: 'center',
  },
  copyBox: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLOR.black._200,
    paddingHorizontal: 10,
    paddingVertical: 12,
    columnGap: 16,
    alignItems: 'center',
    borderRadius: 14,
  },
  rowSection: {
    rowGap: 4,
    marginBottom: 20,
  },
  infoBox: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLOR.black._90010,
  },
})
