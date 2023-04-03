import React, { ReactElement } from 'react'
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  Pressable,
  ImageBackground,
  TouchableOpacity,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import { COLOR, UTIL } from 'consts'
import { ContractAddr, SupportedNetworkEnum, pToken } from 'types'
import images from 'assets/images'

import { Routes } from 'libs/navigation'
import { Card, FormButton, FormImage, MediaRenderer, Row } from 'components'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useEthPrice from 'hooks/independent/useEthPrice'
import { getProfileImgFromProfile } from 'libs/lens'
import useUserBalance from 'hooks/independent/useUserBalance'
import SupportedNetworkRow from './molecules/SupportedNetworkRow'
import useProfile from 'hooks/independent/useProfile'

const ProfileHeader = ({
  userAddress,
  isMyPage,
  selectedNetwork,
  onNetworkSelected,
}: {
  userAddress?: ContractAddr
  isMyPage: boolean
  selectedNetwork: SupportedNetworkEnum
  onNetworkSelected?: (selectedNetwork: SupportedNetworkEnum) => void
}): ReactElement => {
  const { navigation } = useAppNavigation()
  const { getEthPrice } = useEthPrice()
  const { profile } = useProfile({ address: userAddress })
  const profileImg = getProfileImgFromProfile(profile)

  const { ethBalance } = useUserBalance({
    address: userAddress,
    chain: SupportedNetworkEnum.ETHEREUM,
  })

  return (
    <View style={styles.container}>
      <ImageBackground
        blurRadius={10}
        imageStyle={{
          opacity: 0.7,
          borderBottomRightRadius: 30,
          borderBottomLeftRadius: 30,
        }}
        source={profileImg ? { uri: profileImg } : images.profile_temp}
        style={styles.topSection}>
        {isMyPage ? (
          <View style={{ alignItems: 'flex-end' }}>
            <Pressable
              style={styles.headerButton}
              onPress={(): void => {
                navigation.navigate(Routes.Setting)
              }}>
              <Icon name={'settings-outline'} size={24} />
            </Pressable>
          </View>
        ) : (
          <View style={{ alignItems: 'flex-start' }}>
            <Pressable
              style={styles.headerButton}
              onPress={(): void => {
                navigation.goBack()
              }}>
              <Icon name="ios-chevron-back" color={COLOR.gray._800} size={24} />
            </Pressable>
          </View>
        )}
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
        </View>
        <View style={styles.profileNicknameBox}>
          <Card style={styles.profileNicknameCard}>
            <Text style={{ color: 'black' }}>{profile?.handle}</Text>
          </Card>
        </View>
        <Card
          style={{
            marginHorizontal: 10,
            padding: 20,
            rowGap: 20,
            marginBottom: -30,
          }}>
          <Row style={styles.walletBalanceBox}>
            <Row style={{ alignItems: 'center', columnGap: 10 }}>
              <View style={styles.walletIconBox}>
                <Icon name="wallet" color={COLOR.primary._400} size={20} />
              </View>
              <View>
                <Text style={{ color: 'black' }}>Wallet</Text>
                <Text>{UTIL.truncate(userAddress || '')}</Text>
              </View>
            </Row>
            <View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: COLOR.primary._400,
                    fontWeight: 'bold',
                  }}>
                  {UTIL.formatAmountP(ethBalance || ('0' as pToken), {
                    toFix: 4,
                  })}{' '}
                  ETH
                </Text>
                <Text style={{ fontSize: 12 }}>
                  $
                  {UTIL.formatAmountP(
                    getEthPrice(ethBalance || ('0' as pToken)),
                    {
                      toFix: 0,
                    }
                  )}
                </Text>
              </View>
            </View>
          </Row>
          {!!profile?.attributes?.length && (
            <View
              style={{
                padding: 6,
              }}>
              <FlatList
                data={profile.attributes}
                keyExtractor={(_, index): string =>
                  `profile-attribute-${index}`
                }
                horizontal
                contentContainerStyle={{
                  gap: 20,
                  marginHorizontal: '5%',
                }}
                renderItem={({
                  item,
                }: {
                  item: { key: string; value: string }
                }): ReactElement | null =>
                  item.key === 'app' ? null : (
                    <View
                      style={{
                        marginHorizontal: 15,
                        alignItems: 'center',
                      }}>
                      <Text style={styles.attribute}>{item.key}</Text>
                      <Text>{item.value}</Text>
                    </View>
                  )
                }
              />
            </View>
          )}
          <TouchableOpacity
            onPress={(): void => {
              navigation.navigate(Routes.UpdateLensProfile)
            }}>
            <Card style={styles.bioCard}>
              <Text>{profile?.bio || 'Tell us something about you!'}</Text>
            </Card>
          </TouchableOpacity>
        </Card>
      </ImageBackground>
      <View style={styles.body}>
        <Row style={styles.rowButtons}>
          <FormButton containerStyle={{ flex: 1 }} size="sm">
            Owned List
          </FormButton>
          <FormButton containerStyle={{ flex: 1 }} size="sm" disabled>
            Activities
          </FormButton>
        </Row>
        <SupportedNetworkRow
          selectedNetwork={selectedNetwork}
          onNetworkSelected={onNetworkSelected}
        />
      </View>
    </View>
  )
}

export default ProfileHeader

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.primary._100,
  },
  topSection: { marginBottom: 30, paddingTop: 40 },
  body: { gap: 10, padding: 10 },
  profileImgBox: {
    borderRadius: 999,
    alignSelf: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  profileNicknameBox: {
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  profileNicknameCard: {
    width: 180,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  bioCard: {
    padding: 20,
    borderWidth: 1,
    borderColor: COLOR.gray._400,
    borderRadius: 20,
  },
  walletBalanceBox: {
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLOR.primary._100,
    padding: 20,
    borderRadius: 20,
  },
  walletIconBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: 40,
    height: 40,
    borderRadius: 999,
  },
  headerButton: {
    margin: 10,
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 5,
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
})
