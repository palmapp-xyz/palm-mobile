import images from 'assets/images'
import { FormImage, FormText, MediaRenderer, Row } from 'components'
import { COLOR, UTIL } from 'consts'
import useProfile from 'hooks/auth/useProfile'
import useEthPrice from 'hooks/independent/useEthPrice'
import useKlayPrice from 'hooks/independent/useKlayPrice'
import useMaticPrice from 'hooks/independent/useMaticPrice'
import useUserBalance from 'hooks/independent/useUserBalance'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { getProfileMediaImg } from 'libs/lens'
import { Routes } from 'libs/navigation'
import React, { ReactElement } from 'react'
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { ContractAddr, SupportedNetworkEnum, pToken } from 'types'

import Clipboard from '@react-native-clipboard/clipboard'
import { useToast } from '@sendbird/uikit-react-native-foundation'

import LensProfileHeaderSection from './LensProfileHeaderSection'
import SupportedNetworkRow from './molecules/SupportedNetworkRow'

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
    const { getEthPrice } = useEthPrice()
    const { getKlayPrice } = useKlayPrice()
    const { getMaticPrice } = useMaticPrice()
    const toast = useToast()

    const { balance: ethBalance } = useUserBalance({
      address: userAddress,
      chain: SupportedNetworkEnum.ETHEREUM,
    })
    const { balance: klayBalance } = useUserBalance({
      address: userAddress,
      chain: SupportedNetworkEnum.KLAYTN,
    })
    const { balance: maticBalance } = useUserBalance({
      address: userAddress,
      chain: SupportedNetworkEnum.POLYGON,
    })

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

          <View style={styles.section}>
            <FormText fontType="B.20">{profile?.handle}</FormText>
          </View>
          <View style={styles.section}>
            <TouchableOpacity
              onPress={(): void => {
                if (!userAddress) {
                  return
                }
                toast.show('Address copied', 'success')
                Clipboard.setString(userAddress)
              }}
            >
              <Row style={{ alignItems: 'center', columnGap: 10 }}>
                <Icon name="wallet" color={COLOR.primary._400} size={20} />
                <View>
                  <FormText>{UTIL.truncate(userAddress || '')}</FormText>
                </View>
              </Row>
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            <FormText fontType="R.12" color={COLOR.black._200}>
              {profile?.bio}
            </FormText>
          </View>
          {lensProfile && (
            <LensProfileHeaderSection lensProfile={lensProfile} />
          )}
          <View style={styles.walletBalanceBox}>
            <Row
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: 12,
              }}
            >
              <FormText fontType="B.14">My Balance</FormText>
              <FormText fontType="R.10" color={COLOR.black._200}>
                Only visible to you
              </FormText>
            </Row>
            <View style={{ rowGap: 8 }}>
              <View style={styles.balanceItemCard}>
                <Row style={{ alignItems: 'center', columnGap: 12 }}>
                  <FormImage source={images.eth_logo} size={28} />
                  <View>
                    <Row>
                      <FormText fontType="B.16">
                        {UTIL.formatAmountP(ethBalance || ('0' as pToken), {
                          toFix: 4,
                        })}{' '}
                      </FormText>
                      <FormText fontType="R.16">ETH</FormText>
                    </Row>
                    <FormText fontType="R.10" color={COLOR.black._400}>
                      {`(≈$${UTIL.formatAmountP(
                        getEthPrice(ethBalance || ('0' as pToken)),
                        {
                          toFix: 0,
                        }
                      )})`}
                    </FormText>
                  </View>
                </Row>
              </View>
              <View style={styles.balanceItemCard}>
                <Row style={{ alignItems: 'center', columnGap: 12 }}>
                  <FormImage source={images.klay_logo} size={28} />
                  <View>
                    <Row>
                      <FormText fontType="B.16">
                        {UTIL.formatAmountP(klayBalance || ('0' as pToken), {
                          toFix: 4,
                        })}{' '}
                      </FormText>
                      <FormText fontType="R.16">KLAY</FormText>
                    </Row>
                    <FormText fontType="R.10" color={COLOR.black._400}>
                      {`(≈$${UTIL.formatAmountP(
                        getKlayPrice(klayBalance || ('0' as pToken)),
                        {
                          toFix: 0,
                        }
                      )})`}
                    </FormText>
                  </View>
                </Row>
              </View>
              <View style={styles.balanceItemCard}>
                <Row style={{ alignItems: 'center', columnGap: 12 }}>
                  <FormImage source={images.matic_logo} size={28} />
                  <View>
                    <Row>
                      <FormText fontType="B.16">
                        {UTIL.formatAmountP(maticBalance || ('0' as pToken), {
                          toFix: 4,
                        })}{' '}
                      </FormText>
                      <FormText fontType="R.16">MATIC</FormText>
                    </Row>
                    <FormText fontType="R.10" color={COLOR.black._400}>
                      {`(≈$${UTIL.formatAmountP(
                        getMaticPrice(maticBalance || ('0' as pToken)),
                        {
                          toFix: 0,
                        }
                      )})`}
                    </FormText>
                  </View>
                </Row>
              </View>
            </View>
          </View>
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
  bioCard: {
    padding: 20,
    borderWidth: 1,
    borderColor: COLOR.black._400,
    borderRadius: 20,
  },
  walletBalanceBox: { paddingTop: 24 },
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
})
