import React, { ReactElement } from 'react'
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  Pressable,
  ImageBackground,
  ScrollView,
  RefreshControl,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useSendbirdChat } from '@sendbird/uikit-react-native'

import { COLOR, UTIL } from 'consts'

import { Routes } from 'libs/navigation'
import {
  Card,
  FormButton,
  MediaRenderer,
  MoralisNftRenderer,
  Row,
} from 'components'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useMyPageMain from 'hooks/page/myPage/useMyPageMain'
import images from 'assets/images'
import NftItemMenu from 'components/molecules/NftItemMenu'
import { Moralis, pToken } from 'types'
import { fetchNftImage } from 'libs/fetchTokenUri'
import useEthPrice from 'hooks/independent/useEthPrice'
import useLens from 'hooks/independent/useLens'
import { useQuery } from 'react-query'
import { fixIpfsURL } from 'libs/ipfs'

const MyPageScreen = (): ReactElement => {
  const { navigation } = useAppNavigation()
  const { user, useMyNftListReturn, useMyBalanceReturn } = useMyPageMain()
  const { currentUser, setCurrentUser, updateCurrentUserInfo } =
    useSendbirdChat()

  const { getEthPrice } = useEthPrice()
  const { getDefaultProfile } = useLens()

  const { data: lensProfile } = useQuery(['getDefaultProfile'], () =>
    getDefaultProfile()
  )

  const profileImg =
    fixIpfsURL(lensProfile?.defaultProfile.picture.original.url ?? '') ||
    currentUser?.plainProfileUrl

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={useMyNftListReturn.isRefetching}
          onRefresh={(): void => {
            useMyNftListReturn.refetch()
            useMyBalanceReturn.refetch()
          }}
        />
      }>
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
          <View style={{ alignItems: 'flex-end' }}>
            <Pressable
              style={styles.settingIcon}
              onPress={(): void => {
                navigation.navigate(Routes.Setting)
              }}>
              <Icon name={'settings-outline'} size={24} />
            </Pressable>
          </View>
          <View style={styles.profileImgBox}>
            <MediaRenderer
              src={profileImg || images.profile_temp}
              width={100}
              height={100}
              style={{ borderRadius: 50 }}
            />
          </View>
          <View
            style={{
              padding: 20,
              alignItems: 'center',
              width: '100%',
            }}>
            <Card
              style={{
                width: 160,
                paddingHorizontal: 20,
                paddingVertical: 10,
                alignItems: 'center',
              }}>
              <Text style={{ color: 'black' }}>
                {lensProfile?.defaultProfile.handle || currentUser?.nickname}
              </Text>
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
                  <Text>{UTIL.truncate(user?.address || '')}</Text>
                </View>
              </Row>
              <View style={{ alignItems: 'flex-end' }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: COLOR.primary._400,
                    fontWeight: 'bold',
                  }}>
                  {UTIL.formatAmountP(useMyBalanceReturn.balance, { toFix: 4 })}{' '}
                  ETH
                </Text>
                <Text style={{ fontSize: 12 }}>
                  $
                  {UTIL.formatAmountP(
                    getEthPrice(useMyBalanceReturn.balance || ('0' as pToken)),
                    {
                      toFix: 0,
                    }
                  )}
                </Text>
              </View>
            </Row>
            {lensProfile?.defaultProfile.attributes.length && (
              <View
                style={{
                  padding: 6,
                }}>
                <FlatList
                  data={lensProfile?.defaultProfile.attributes}
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
            <View
              style={{
                padding: 20,
                borderWidth: 1,
                borderColor: COLOR.gray._400,
                borderRadius: 20,
              }}>
              <Text>
                {lensProfile?.defaultProfile.bio ||
                  'Tell us something about you!'}
              </Text>
            </View>
          </Card>
        </ImageBackground>
        <View style={styles.body}>
          <Row
            style={{
              width: '100%',
              backgroundColor: 'white',
              alignSelf: 'flex-start',
              padding: 5,
              borderRadius: 10,
              columnGap: 10,
            }}>
            <FormButton containerStyle={{ flex: 1 }} size="sm">
              Owned List
            </FormButton>
            <FormButton containerStyle={{ flex: 1 }} size="sm" disabled>
              Activities
            </FormButton>
          </Row>
          <FlatList
            data={useMyNftListReturn.nftList}
            keyExtractor={(_, index): string => `nftList-${index}`}
            numColumns={2}
            contentContainerStyle={{ gap: 10 }}
            columnWrapperStyle={{ gap: 10 }}
            scrollEnabled={false}
            renderItem={({ item }): ReactElement => (
              <TouchableWithoutFeedback
                onPress={(): void => {
                  navigation.navigate(Routes.NftDetail, {
                    nftContract: item.token_address,
                    tokenId: item.token_id,
                  })
                }}>
                <View style={{ borderRadius: 10, flex: 1 }}>
                  <MoralisNftRenderer item={item} width={'100%'} height={180} />
                  <NftItemMenu
                    item={item}
                    triggerComponent={
                      <View style={styles.nftTitle}>
                        <Text>{`#${item.token_id}`}</Text>
                      </View>
                    }
                    onSelect={async (
                      selectedItem: Moralis.NftItem,
                      selectedOption: string
                    ): Promise<void> => {
                      try {
                        if (selectedOption === 'set_nft_profile') {
                          const url = await fetchNftImage({
                            metadata: selectedItem.metadata,
                            tokenUri: selectedItem.token_uri,
                          })
                          const me = await updateCurrentUserInfo(undefined, url)
                          setCurrentUser(me)
                        }
                      } catch (e) {
                        console.error(e, selectedItem, selectedOption)
                      }
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
            )}
          />
        </View>
      </View>
    </ScrollView>
  )
}

export default MyPageScreen

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
  settingIcon: {
    margin: 10,
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  nftTitle: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 10,
    alignSelf: 'center',
    bottom: 0,
    flex: 1,
  },
  attribute: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
})
