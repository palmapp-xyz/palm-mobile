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
import { useTranslation } from 'react-i18next'

const CreateProfileScreen = (): ReactElement => {
  const { navigation } = useAppNavigation()

  const { user } = useAuth()
  const { t } = useTranslation()
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
    <Container style={styles.container} keyboardAvoiding={true}>
      <Header left="back" onPressLeft={navigation.goBack} />

      <View style={styles.body}>
        <View style={{ rowGap: 8, paddingBottom: 40 }}>
          <FormText fontType="B.24" style={{ fontWeight: 'bold' }}>
            {t('Profiles.CreateProfileTitle')}
          </FormText>
          <FormText color={COLOR.black._400} fontType="R.14">
            {t('Profiles.CreateProfileTitleSub')}
          </FormText>
        </View>
        <View style={{ rowGap: 12 }}>
          <View style={styles.rowSection}>
            <FormText fontType="R.12">
              {t('Profiles.CreateProfileUsername')}
            </FormText>
            <FormInput
              value={handle}
              onChangeText={setHandle}
              textContentType="username"
              fontType="R.12"
              placeholder={t('Profiles.CreateProfileUsernamePlaceholder')}
              autoCapitalize="none"
              style={{ marginVertical: 2 }}
            />
            <FormText fontType="R.12" color={COLOR.yellow}>
              {t('Profiles.CreateProfileUsernameHint')}
            </FormText>
          </View>
          <View style={styles.rowSection}>
            <Row>
              <FormText fontType="R.12">
                {t('Profiles.CreateProfileDescription')}
              </FormText>
              <FormText fontType="R.12">
                ({bio.length}/{maxBioLength})
              </FormText>
            </Row>
            <FormInput
              value={bio}
              textAlignVertical="top"
              onChangeText={(text: string): void => {
                if (text.length <= maxBioLength) {
                  setBio(text)
                }
              }}
              fontType="R.12"
              multiline={true}
              maxLength={maxBioLength}
              placeholder={t('Profiles.CreateProfileDescriptionPlaceholder')}
              secureTextEntry
              style={{ marginVertical: 2, minHeight: 200 }}
            />
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <FormButton
          size="lg"
          disabled={loading || handle.length === 0}
          onPress={onClickConfirm}
        >
          {t('Common.Done')}
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
