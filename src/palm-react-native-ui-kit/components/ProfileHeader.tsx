import { COLOR } from 'palm-core/consts'
import { getProfileMediaImg } from 'palm-core/libs/lens'
import { Routes } from 'palm-core/libs/navigation'
import { ContractAddr, SupportedNetworkEnum } from 'palm-core/types'
import { FormText, Row } from 'palm-react-native-ui-kit/components'
import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import useProfile from 'palm-react/hooks/auth/useProfile'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageBackground, Pressable, StyleSheet, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { useSafeAreaInsets } from 'react-native-safe-area-context'
import LensProfileHeaderSection from './LensProfileHeaderSection'
import ProfileHeaderChatButton from './ProfileHeaderChatButton'
import ProfileWalletAddress from './ProfileWalletAddress'
import ProfileWalletBalances from './ProfileWalletBalances'
import { ChannelUserControlButton } from './channel/ChannelUserControl'
import SupportedNetworkRow from './molecules/SupportedNetworkRow'
import Avatar from './sendbird/Avatar'

export type ProfileHeaderProps = {
  userAddress?: ContractAddr
  userProfileId?: string
  isMyPage: boolean
  isNavigationPerformedByOperator?: boolean
  selectedNetwork: SupportedNetworkEnum
  onNetworkSelected?: (selectedNetwork: SupportedNetworkEnum) => void
  onToggleShowUserTokensSheet?: () => void
  onToggleChannelUserControl?: () => void
}

const ProfileHeader = React.memo(
  ({
    userAddress,
    userProfileId,
    isMyPage,
    isNavigationPerformedByOperator,
    selectedNetwork,
    onNetworkSelected,
    onToggleShowUserTokensSheet,
    onToggleChannelUserControl,
  }: ProfileHeaderProps): ReactElement => {
    const { navigation } = useAppNavigation()
    const { t } = useTranslation()

    const { profile, lensProfile } = useProfile({ profileId: userProfileId! })
    const profileImg = getProfileMediaImg(profile?.picture)

    const { top } = useSafeAreaInsets()

    return (
      <View style={styles.container}>
        <View
          style={[
            styles.header,
            {
              height: 168 + top,
            },
          ]}
        >
          <ImageBackground
            source={{ uri: profile?.coverPicture }}
            resizeMode="cover"
            style={{ flex: 1 }}
          >
            {isMyPage ? (
              <View style={{ marginTop: top, alignItems: 'flex-end' }}>
                <Row style={styles.headerButtons}>
                  <Pressable
                    style={styles.headerButton}
                    onPress={(): void => {
                      navigation.navigate(Routes.UpdateProfile)
                    }}
                  >
                    <Ionicons name={'pencil'} size={28} />
                  </Pressable>
                  <Pressable
                    style={styles.headerButton}
                    onPress={(): void => {
                      navigation.navigate(Routes.Setting)
                    }}
                  >
                    <Ionicons name={'settings-outline'} size={28} />
                  </Pressable>
                </Row>
              </View>
            ) : (
              <View
                style={{
                  marginTop: top,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Pressable
                  style={styles.headerButton}
                  onPress={(): void => {
                    navigation.goBack()
                  }}
                >
                  <Ionicons
                    name="ios-chevron-back"
                    color={COLOR.black._800}
                    size={28}
                  />
                </Pressable>
                {isNavigationPerformedByOperator && (
                  <ChannelUserControlButton
                    style={styles.headerButton}
                    onToggleChannelUserControl={onToggleChannelUserControl}
                  />
                )}
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
              <FormText size={20} font={'B'}>
                {profile.handle.trim()}
              </FormText>
            </View>
          )}

          {profile?.bio && (
            <View style={styles.section}>
              <FormText color={COLOR.black._200}>{profile.bio.trim()}</FormText>
            </View>
          )}

          {lensProfile && (
            <LensProfileHeaderSection lensProfile={lensProfile} />
          )}

          {!isMyPage && (
            <ProfileHeaderChatButton userProfileId={userProfileId} />
          )}

          <ProfileWalletAddress userAddress={userAddress} />

          {isMyPage && (
            <ProfileWalletBalances
              userAddress={userAddress}
              onToggleShowUserTokensSheet={onToggleShowUserTokensSheet}
            />
          )}

          <View
            style={{
              rowGap: 12,
              marginBottom: 12,
              marginTop: !isMyPage ? 12 : 0,
            }}
          >
            <FormText font={'B'}>
              {t('Components.ProfileHeader.NftList')}
            </FormText>
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
