import { COLOR } from 'palm-core/consts'
import { getProfileMediaImg } from 'palm-core/libs/lens'
import { Routes } from 'palm-core/libs/navigation'
import { ContractAddr } from 'palm-core/types'
import { FormImage, MediaRenderer } from 'palm-react-native-ui-kit/components'
import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import useProfile from 'palm-react/hooks/auth/useProfile'
import images from 'palm-ui-kit/assets/images'
import React, { ReactElement } from 'react'
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

export type UpdateProfileHeaderProps = {
  userAddress?: ContractAddr
  userProfileId?: string
  onClickConfirm?: () => Promise<void>
}

const UpdateProfileHeader = React.memo(
  ({
    userAddress,
    userProfileId,
    onClickConfirm,
  }: UpdateProfileHeaderProps): ReactElement => {
    const { navigation } = useAppNavigation()

    const { profile } = useProfile({ profileId: userProfileId! })
    const profileImg = getProfileMediaImg(profile?.picture)

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <ImageBackground
            source={{ uri: profile?.coverPicture }}
            resizeMode="cover"
            style={{ flex: 1 }}
          >
            <View style={{ alignItems: 'flex-start' }}>
              <Pressable
                style={styles.headerButton}
                onPress={(): void => {
                  navigation.goBack()
                }}
              >
                <Icon
                  name="ios-chevron-back"
                  color={COLOR.black._800}
                  size={24}
                />
              </Pressable>
            </View>
            {onClickConfirm && (
              <View style={{ alignItems: 'flex-end' }}>
                <Pressable style={styles.headerButton} onPress={onClickConfirm}>
                  <Icon
                    name="check-circle"
                    color={COLOR.primary._300}
                    size={24}
                  />
                </Pressable>
              </View>
            )}
          </ImageBackground>
        </View>
        <View style={{ backgroundColor: 'white', paddingHorizontal: 20 }}>
          <View style={styles.profileImgBox}>
            {profileImg ? (
              <MediaRenderer
                src={profileImg}
                width={100}
                height={100}
                style={{ borderRadius: 50 }}
              />
            ) : (
              <FormImage
                source={images.profile_temp}
                size={100}
                style={{ borderRadius: 50 }}
              />
            )}
            <TouchableOpacity
              style={styles.editButton}
              onPress={(): void => {
                userAddress &&
                  userProfileId &&
                  navigation.navigate(Routes.NftSelect, {
                    type: 'select-profile',
                    address: userAddress,
                    profileId: userProfileId,
                  })
              }}
            >
              <Icon name={'pencil'} size={14} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
)

export default UpdateProfileHeader

const styles = StyleSheet.create({
  container: { backgroundColor: 'white' },
  header: {
    height: 168,
    backgroundColor: COLOR.black._90010,
  },
  profileImgBox: {
    width: 100,
    height: 100,
    borderRadius: 999,
    marginTop: -88,
  },
  section: {
    paddingBottom: 12,
  },
  bioCard: {
    padding: 20,
    borderWidth: 1,
    borderColor: COLOR.black._400,
    borderRadius: 20,
  },
  walletBalanceBox: { paddingTop: 32 },
  balanceItemCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLOR.black._90005,
    borderRadius: 16,
  },
  headerButtons: {
    padding: 10,
  },
  headerButton: {
    marginHorizontal: 5,
    padding: 5,
  },
  attribute: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  rowButtons: {
    width: '100%',
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    padding: 5,
    borderRadius: 10,
    columnGap: 10,
  },
  editButton: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'white',
    bottom: 5,
    end: 5,
    padding: 5,
  },
})
