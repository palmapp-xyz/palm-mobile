import React, { ReactElement, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useAlert } from '@sendbird/uikit-react-native-foundation'

import { COLOR } from 'consts'
import { Container, FormButton, FormInput, Header } from 'components'
import useAuth from 'hooks/auth/useAuth'

import { useAppNavigation } from 'hooks/useAppNavigation'
import { SupportedNetworkEnum } from 'types'
import { useRecoilState } from 'recoil'
import appStore from 'store/appStore'
import useProfile from 'hooks/auth/useProfile'
import { ProfileMetadata } from '@lens-protocol/react-native-lens-ui-kit'
import { getAttributesData } from 'libs/lens'
import { PublicationMetadataStatusType } from 'graphqls/__generated__/graphql'

const UpdateLensProfileScreen = (): ReactElement => {
  const { navigation } = useAppNavigation()
  const { user } = useAuth(SupportedNetworkEnum.ETHEREUM)
  const { alert } = useAlert()

  const [loading, setLoading] = useRecoilState(appStore.loading)

  const { profile, setMetadata } = useProfile({ profileId: user?.profileId })

  const [updatedProfile, setUpdatedProfile] = useState<
    Partial<ProfileMetadata>
  >({
    name: profile?.name || undefined,
    bio: profile?.bio || undefined,
    attributes: getAttributesData(profile),
  })

  const update = async (): Promise<void> => {
    if (profile) {
      const result = await setMetadata(updatedProfile)
      setLoading(false)
      setTimeout(() => {
        if (!result.success) {
          if (result.errMsg === PublicationMetadataStatusType.Pending) {
            alert({
              title: 'Pending',
              message:
                'Your profile will be reflected once update transaction gets indexed.',
            })
          } else {
            alert({
              title: 'Failure',
              message: result.errMsg,
            })
          }
        } else {
          alert({
            title: 'Success',
            message: 'Profile updated',
          })
        }
      }, 300)
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

  return (
    <Container style={styles.container}>
      <Header
        title="Update Bio"
        left={
          <Icon name="ios-chevron-back" color={COLOR.black._800} size={20} />
        }
        onPressLeft={navigation.goBack}
      />
      {!profile ? (
        <View style={styles.body}>
          <ActivityIndicator size="large" color={COLOR.primary._300} />
        </View>
      ) : (
        <View style={styles.body}>
          <View style={{ rowGap: 10, padding: 20 }}>
            <Text style={styles.headText}>Bio</Text>
            <FormInput
              style={{ height: 150, paddingTop: 10, paddingBottom: 10 }}
              placeholder="Input your bio"
              value={updatedProfile?.bio || ''}
              onChangeText={(bio: string): void => {
                setUpdatedProfile({ ...updatedProfile, bio })
              }}
              textContentType="none"
              multiline
              secureTextEntry
            />
          </View>
          <FormButton disabled={loading} onPress={onClickConfirm}>
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
  headText: {
    fontWeight: 'bold',
    margin: 4,
  },
})
