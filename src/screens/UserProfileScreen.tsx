import React, { ReactElement } from 'react'
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  ImageBackground,
  ScrollView,
  RefreshControl,
  TouchableWithoutFeedback,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { UserListStatusError } from '@sendbird/uikit-react-native'

import { COLOR, UTIL } from 'consts'

import { Routes } from 'libs/navigation'
import {
  Card,
  Container,
  Header,
  MediaRenderer,
  MoralisNftRenderer,
  Row,
} from 'components'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useSetting from 'hooks/independent/useSetting'
import useUserNftList from 'hooks/api/useUserNftList'
import useUserBalance from 'hooks/independent/useUserBalance'

const UserProfileScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.UserProfile>()
  const userAddress = params.address

  const useUserNftListReturn = useUserNftList({
    userAddress,
  })
  const { balance } = useUserBalance({ address: userAddress })
  UserListStatusError
  const { setting } = useSetting()

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={useUserNftListReturn.isRefetching}
          onRefresh={(): void => {
            useUserNftListReturn.refetch()
          }}
        />
      }>
      <Container style={styles.container}>
        <Header
          title={params.nickName || UTIL.truncate(userAddress)}
          left={
            <Icon name="ios-chevron-back" color={COLOR.gray._800} size={20} />
          }
          onPressLeft={navigation.goBack}
        />
        <ImageBackground
          blurRadius={10}
          imageStyle={{ opacity: 0.7 }}
          source={{ uri: params.plainProfileUrl }}
          style={styles.topSection}>
          <View style={styles.profileImgBox}>
            <MediaRenderer
              src={params.plainProfileUrl}
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
                  <Text>{UTIL.truncate(userAddress)}</Text>
                </View>
                <Text style={{ fontSize: 20 }}>
                  {UTIL.formatAmountP(balance, { toFix: 4 })} ETH
                </Text>
              </Row>
            </Card>
          </View>
        </ImageBackground>
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
            data={useUserNftListReturn.nftList}
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
                </View>
              </TouchableWithoutFeedback>
            )}
          />
        </View>
      </Container>
    </ScrollView>
  )
}

export default UserProfileScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.primary._100,
  },
  topSection: { paddingTop: 30 },
  body: { gap: 10, padding: 10 },
  profileImgBox: {
    borderRadius: 999,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: 'white',
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
