import React, { ReactElement, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useAlert } from '@sendbird/uikit-react-native-foundation'

import { COLOR } from 'consts'
import { Container, FormButton, Header } from 'components'
import useLens from 'hooks/lens/useLens'
import useAuth from 'hooks/independent/useAuth'
import useLensProfile from 'hooks/lens/useLensProfile'

import { useAppNavigation } from 'hooks/useAppNavigation'
import { SupportedNetworkEnum, User } from 'types'
import { Profile } from 'graphqls/__generated__/graphql'
import useFsProfile from 'hooks/firestore/useFsProfile'

const UpdateLensProfileScreen = (): ReactElement => {
  const [isFetching, setIsFetching] = useState(false)

  const { navigation } = useAppNavigation()
  const { user } = useAuth(SupportedNetworkEnum.ETHEREUM)
  const { setMetadata } = useLens()
  const { alert } = useAlert()

  const {
    profile,
    loading,
    refetch: refetchLensProfile,
  } = useLensProfile({
    userAddress: user?.address,
  })

  const {
    fsProfile,
    fsProfileField,
    refetch: refetchFsProfile,
  } = useFsProfile({
    address: user?.address,
  })

  const userProfile: Profile | User | undefined = profile || fsProfileField

  const [updatedProfile, _setUpdatedProfile] = useState<
    Profile | User | undefined
  >(profile || fsProfileField)

  const onClickConfirm = async (): Promise<void> => {
    if (!updatedProfile) {
      return
    }
    setIsFetching(true)
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
      await Promise.all([refetchFsProfile(), refetchLensProfile()])
      alert({ message: 'Profile updated' })
    }

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
                  bio: userProfile?.bio,
                  name: userProfile?.name,
                  attributes: userProfile?.attributes,
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
