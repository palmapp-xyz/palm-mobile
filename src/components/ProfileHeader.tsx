import { FormText, Row } from 'components'
import { COLOR } from 'consts'
import useProfile from 'hooks/auth/useProfile'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { getProfileMediaImg } from 'libs/lens'
import { Routes } from 'libs/navigation'
import React, { ReactElement } from 'react'
import { ImageBackground, Pressable, StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { ContractAddr, SupportedNetworkEnum } from 'types'

import LensProfileHeaderSection from './LensProfileHeaderSection'
import SupportedNetworkRow from './molecules/SupportedNetworkRow'
import ProfileHeaderChatButton from './ProfileHeaderChatButton'
import ProfileWalletAddress from './ProfileWalletAddress'
import ProfileWalletBalances from './ProfileWalletBalances'
import Avatar from './sendbird/Avatar'

export type ProfileHeaderProps = {
  userAddress?: ContractAddr
  userProfileId?: string
  isMyPage: boolean
  selectedNetwork: SupportedNetworkEnum
  onNetworkSelected?: (selectedNetwork: SupportedNetworkEnum) => void
}

const ProfileHeader = React.memo(
  ({
    userAddress,
    userProfileId,
    isMyPage,
    selectedNetwork,
    onNetworkSelected,
  }: ProfileHeaderProps): ReactElement => {
    const { navigation } = useAppNavigation()

    const { profile, lensProfile } = useProfile({ profileId: userProfileId })
    const profileImg = getProfileMediaImg(profile?.picture)

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <ImageBackground
            source={{ uri: profile?.coverPicture }}
            resizeMode="cover"
            style={{ flex: 1 }}
          >
            {isMyPage ? (
              <View style={{ alignItems: 'flex-end' }}>
                <Row style={styles.headerButtons}>
                  <Pressable
                    style={styles.headerButton}
                    onPress={(): void => {
                      navigation.navigate(Routes.UpdateProfile)
                    }}
                  >
                    <Icon name={'pencil'} size={24} />
                  </Pressable>
                  <Pressable
                    style={styles.headerButton}
                    onPress={(): void => {
                      navigation.navigate(Routes.Setting)
                    }}
                  >
                    <Icon name={'settings-outline'} size={24} />
                  </Pressable>
                </Row>
              </View>
            ) : (
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
            )}
          </ImageBackground>
        </View>

        <View style={{ backgroundColor: 'white', paddingHorizontal: 20 }}>
          <View style={styles.profileImgBox}>
            <Avatar uri={profileImg} size={100} />
          </View>

          {profile?.handle && (
            <View style={styles.section}>
              <FormText fontType="B.20">{profile.handle.trim()}</FormText>
            </View>
          )}

          {profile?.bio && (
            <View style={styles.section}>
              <FormText fontType="R.12" color={COLOR.black._200}>
                {profile.bio.trim()}
              </FormText>
            </View>
          )}

          {lensProfile && (
            <LensProfileHeaderSection lensProfile={lensProfile} />
          )}

          {!isMyPage && (
            <ProfileHeaderChatButton userProfileId={userProfileId} />
          )}

          <ProfileWalletAddress userAddress={userAddress} />

          {isMyPage && <ProfileWalletBalances userAddress={userAddress} />}

          <View style={{ paddingTop: 32, rowGap: 12, paddingBottom: 12 }}>
            <FormText fontType="B.14">NFT List</FormText>
            <SupportedNetworkRow
              selectedNetwork={selectedNetwork}
              onNetworkSelected={onNetworkSelected}
            />
          </View>
        </View>
      </View>
    )
  }
)

export default ProfileHeader

const styles = StyleSheet.create({
  container: { backgroundColor: 'white' },
  header: {
    height: 168,
    backgroundColor: COLOR.black._90010,
  },
  profileImgBox: {
    borderRadius: 999,
    marginTop: -88,
  },
  section: {
    paddingBottom: 12,
  },
  headerButtons: {
    padding: 10,
  },
  headerButton: {
    marginHorizontal: 5,
    padding: 5,
  },
})
