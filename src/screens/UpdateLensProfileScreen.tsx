import React, { ReactElement, useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useAlert } from '@sendbird/uikit-react-native-foundation'

import { COLOR } from 'consts'
import { Container, FormButton, FormInput, Header } from 'components'
import useLens from 'hooks/lens/useLens'
import useAuth from 'hooks/independent/useAuth'
import useLensProfile from 'hooks/lens/useLensProfile'

import { useAppNavigation } from 'hooks/useAppNavigation'
import { SupportedNetworkEnum, User } from 'types'
import { Profile } from 'graphqls/__generated__/graphql'
import useFsProfile from 'hooks/firestore/useFsProfile'
import { useRecoilState } from 'recoil'
import appStore from 'store/appStore'

const UpdateLensProfileScreen = (): ReactElement => {
  const { navigation } = useAppNavigation()
  const { user } = useAuth(SupportedNetworkEnum.ETHEREUM)
  const { setMetadata } = useLens()
  const { alert } = useAlert()

  const [loading, setLoading] = useRecoilState(appStore.loading)
  const [refetching, setRefetching] = useState(false)

  const {
    profile,
    isLoading: loadingLensProfile,
    refetch: refetchLensProfile,
  } = useLensProfile({ userAddress: user?.address })

  const {
    fsProfile,
    fsProfileField,
    refetch: refetchFsProfile,
    isRefetching: isRefetchingProfile,
  } = useFsProfile({
    address: user?.address,
  })

  const userProfile: Profile | User | undefined = profile || fsProfileField

  const [updatedProfile, setUpdatedProfile] = useState<
    Profile | User | undefined
  >(userProfile)

  const update = async (): Promise<void> => {
    let doUpdate = true
    if (profile) {
      const result = await setMetadata(updatedProfile as Profile)
      if (!result.success) {
        alert({ message: result.errMsg })
        doUpdate = false
      }
    }

    if (doUpdate) {
      if (fsProfile) {
        await fsProfile.set(
          { lensProfile: profile, ...updatedProfile },
          { merge: true }
        )
      }
      setRefetching(true)
      await Promise.all([refetchFsProfile(), refetchLensProfile()])
      alert({ message: 'Profile updated' })
    }
  }

  const onClickConfirm = async (): Promise<void> => {
    if (!updatedProfile) {
      return
    }
    setLoading(true)
    setTimeout(() => {
      update()
    }, 500)
  }

  useEffect(() => {
    if (refetching) {
      setRefetching(false)
      setLoading(false)
    }
  }, [isRefetchingProfile])

  return (
    <Container style={styles.container}>
      <Header
        title="Update Profile"
        left={
          <Icon name="ios-chevron-back" color={COLOR.gray._800} size={20} />
        }
        onPressLeft={navigation.goBack}
      />
      {!userProfile ? (
        <View style={styles.body}>
          <ActivityIndicator size="large" color={COLOR.primary._100} />
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
                setUpdatedProfile({ ...updatedProfile, bio } as User)
              }}
              textContentType="none"
              multiline
              secureTextEntry
            />
          </View>
          <FormButton
            disabled={loading || loadingLensProfile}
            onPress={onClickConfirm}>
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
