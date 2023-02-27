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
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import { COLOR, UTIL } from 'consts'

import { Routes } from 'libs/navigation'
import { Card, Container, FormImage, MoralisNftCard, Row } from 'components'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useMyPageMain from 'hooks/page/myPage/useMyPageMain'
import useSetting from 'hooks/independent/useSetting'
import images from 'assets/images'

const MyPageScreen = (): ReactElement => {
  const { navigation } = useAppNavigation()
  const { user, useMyNftListReturn, balance } = useMyPageMain()
  const { setting } = useSetting()

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
              <FormImage
                source={images.profile_temp}
                size={100}
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
            renderItem={({ item }): ReactElement => {
              return (
                <View
                  style={{ flex: 1, backgroundColor: 'white', padding: 10 }}>
                  <MoralisNftCard item={item} />
                </View>
              )
            }}
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
  body: {
    gap: 10,
    padding: 10,
  },
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
})
