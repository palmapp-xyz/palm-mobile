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
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import { COLOR, UTIL } from 'consts'

import { Routes } from 'libs/navigation'
import {
  Card,
  Container,
  MediaRenderer,
  MoralisNftRenderer,
  Row,
} from 'components'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useMyPageMain from 'hooks/page/myPage/useMyPageMain'
import useSetting from 'hooks/independent/useSetting'
import images from 'assets/images'
import NftItemMenu from 'components/molecules/NftItemMenu'
import { Moralis } from 'types'
import { useSendbirdChat } from '@sendbird/uikit-react-native'
import { fetchNftImage } from 'libs/fetchTokenUri'

const MyPageScreen = (): ReactElement => {
  const { navigation } = useAppNavigation()
  const { user, useMyNftListReturn, balance } = useMyPageMain()
  const { setting } = useSetting()
  const { currentUser, setCurrentUser, updateCurrentUserInfo } =
    useSendbirdChat()

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={useMyNftListReturn.isRefetching}
          onRefresh={(): void => {
            useMyNftListReturn.refetch()
          }}
        />
      }>
      <Container style={styles.container}>
        <View style={styles.header}>
          <ImageBackground blurRadius={6} source={images.profile_temp}>
            <View style={{ alignItems: 'flex-end' }}>
              <Pressable
                style={styles.settingIcon}
                onPress={(): void => {
                  navigation.navigate(Routes.Setting)
                }}>
                <Icon name={'settings'} size={24} />
              </Pressable>
            </View>
            <View style={styles.profileImgBox}>
              <MediaRenderer
                src={currentUser?.plainProfileUrl || images.profile_temp}
                width={100}
                height={100}
                style={{ borderRadius: 50 }}
              />
            </View>
            <View
              style={{
                padding: 30,
                alignItems: 'center',
                width: '100%',
              }}>
              <Card style={{ width: '100%' }}>
                <Text>{`Network : ${setting.network}`}</Text>
                <Row style={{ justifyContent: 'space-between' }}>
                  <View>
                    <Text>Wallet</Text>
                    <Text>{UTIL.truncate(user?.address || '')}</Text>
                  </View>
                  <Text style={{ fontSize: 20 }}>
                    {UTIL.formatAmountP(balance, { toFix: 4 })} ETH
                  </Text>
                </Row>
              </Card>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.body}>
          <View
            style={{
              backgroundColor: 'white',
              alignSelf: 'flex-start',
              padding: 5,
              borderRadius: 10,
            }}>
            <Text style={{ fontSize: 20 }}>Owned NFT List</Text>
          </View>
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
      </Container>
    </ScrollView>
  )
}

export default MyPageScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.primary._100,
  },
  header: {},
  body: { gap: 10, padding: 10 },
  profileImgBox: {
    borderRadius: 999,
    alignSelf: 'center',
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
})
