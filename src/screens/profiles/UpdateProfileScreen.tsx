import { Container, FormButton, FormInput, FormText, Row } from 'components'
import LoadingPage from 'components/atoms/LoadingPage'
import UpdateProfileHeader from 'components/UpdateProfileHeader'
import { COLOR } from 'core/consts'
import { PublicationMetadataStatusType } from 'core/graphqls/__generated__/graphql'
import { getAttributesData } from 'core/libs/lens'
import useAuth from 'hooks/auth/useAuth'
import useProfile from 'hooks/auth/useProfile'
import { useAppNavigation } from 'hooks/useAppNavigation'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import appStore from 'react/store/appStore'
import { useRecoilState } from 'recoil'

import {
  AttributeData,
  ProfileMetadata,
} from '@lens-protocol/react-native-lens-ui-kit'
import { useLocalization } from '@sendbird/uikit-react-native'
import { useAlert } from '@sendbird/uikit-react-native-foundation'

const UpdateProfileScreen = (): ReactElement => {
  const { user } = useAuth()
  const { alert } = useAlert()
  const { t } = useTranslation()

  const [loading, setLoading] = useRecoilState(appStore.loading)
  const { navigation } = useAppNavigation()
  const { STRINGS } = useLocalization()

  const { profile, setMetadata } = useProfile({
    profileId: user?.auth?.profileId,
  })

  const [name, setName] = useState<string>()
  const [bio, setBio] = useState<string>()
  const [attributes, setAttributes] = useState<AttributeData[]>()

  const update = async (): Promise<void> => {
    if (profile) {
      const result = await setMetadata({
        name,
        bio,
        attributes,
      } as Partial<ProfileMetadata>)
      setLoading(false)
      if (!result.success) {
        if (result.errMsg === PublicationMetadataStatusType.Pending) {
          alert({
            title: t('Profiles.UpdateProfilePendingAlertTitle'),
            message: t('Profiles.UpdateProfilePendingAlertMessage'),
          })
        } else {
          alert({
            title: t('Profiles.UpdateProfileFailureAlertTitle'),
            message: result.errMsg,
          })
        }
      } else {
        alert({
          title: t('Profiles.UpdateProfileSuccessAlertTitle'),
          message: t('Profiles.UpdateProfileSuccessAlertMessage'),
          buttons: [
            {
              text: STRINGS.DIALOG.ALERT_DEFAULT_OK,
              onPress: () => navigation.goBack(),
            },
          ],
        })
      }
    }
  }

  const onClickConfirm = async (): Promise<void> => {
    if (!profile) {
      return
    }
    setLoading(true)
    setTimeout(() => {
      update()
    }, 300)
  }

  useEffect(() => {
    if (
      !profile ||
      name !== undefined ||
      bio !== undefined ||
      attributes !== undefined
    ) {
      return
    }

    setName(profile.name)
    setBio(profile.bio)
    setAttributes(getAttributesData(profile))
  }, [profile])

  if (!profile) {
    return <LoadingPage />
  }

  const maxBioLength = 300

  return (
    <Container style={styles.container} keyboardAvoiding={true}>
      <UpdateProfileHeader
        userProfileId={user?.auth?.profileId}
        userAddress={user?.address}
      />

      <View style={styles.body}>
        <View style={{ rowGap: 12 }}>
          <View style={styles.rowSection}>
            <FormText>{t('Profiles.UpdateProfileUsername')}</FormText>
            <FormInput
              value={profile.handle}
              textContentType="username"
              placeholder={t('Profiles.UpdateProfileUsernamePlaceholder')}
              autoCapitalize="none"
              style={{
                marginVertical: 2,
                color: COLOR.black._500,
                backgroundColor: COLOR.black._10,
              }}
              editable={false}
            />
          </View>
          <View style={styles.rowSection}>
            <Row>
              <FormText>{t('Profiles.UpdateProfileDescription')}</FormText>
              <FormText>
                ({bio?.length ?? 0}/{maxBioLength})
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
              multiline={true}
              maxLength={maxBioLength}
              placeholder={t('Profiles.UpdateProfileDescriptionPlaceholder')}
              style={{ marginVertical: 2, minHeight: 200 }}
            />
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <FormButton
          size="lg"
          disabled={loading || bio === profile?.bio}
          onPress={onClickConfirm}
        >
          {t('Common.Done')}
        </FormButton>
      </View>
    </Container>
  )
}

export default UpdateProfileScreen

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
