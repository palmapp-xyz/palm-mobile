import React, { ReactElement, useState } from 'react'
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import { Container, Header, NftRenderer } from 'components'

import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import { useSendbirdChat } from '@sendbird/uikit-react-native'
import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import { useAsyncEffect } from '@sendbird/uikit-utils'

import firestore from '@react-native-firebase/firestore'
import { zx } from 'types'
import Icon from 'react-native-vector-icons/Ionicons'
import { COLOR } from 'consts'

const Contents = ({ channelUrl }: { channelUrl: string }): ReactElement => {
  const { navigation } = useAppNavigation<Routes.ChannelListings>()

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, channelUrl)

  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [orderList, setOrderList] = useState<zx.order['order'][]>([])

  useAsyncEffect(async () => {
    if (!channel) {
      return
    }

    try {
      const channelDoc = await firestore()
        .collection('channels')
        .doc(channel.url)
        .get()
      // legacy: add the non-existing (if not exists) channel to firestore
      if (!channelDoc.exists) {
        await firestore()
          .collection('channels')
          .doc(channel.url)
          .set({ url: channel.url, channelType: channel.channelType })
      }
      // add the new listing item to the corresponding channel doc firestore
      const orders: zx.order['order'][] = []
      await firestore()
        .collection('channels')
        .doc(channel.url)
        .collection('listings')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            const order = documentSnapshot.data() as zx.order['order']
            if (order) {
              orders.push(order)
            }
          })
        })
      setOrderList(orders)
      setIsFetching(false)
    } catch (e) {
      console.error(e)
    }
  }, [channel, isFetching])

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={isFetching}
          onRefresh={(): void => {
            setIsFetching(true)
          }}
        />
      }>
      <Container style={styles.container}>
        <View style={styles.body}>
          <FlatList
            data={orderList}
            keyExtractor={(_, index): string => `orderList-${index}`}
            numColumns={2}
            scrollEnabled={false}
            style={{ paddingHorizontal: 20 }}
            contentContainerStyle={{ gap: 10 }}
            columnWrapperStyle={{ gap: 10 }}
            renderItem={({ item: order }): ReactElement => {
              return (
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    flex: 1,
                    justifyContent: 'center',
                  }}
                  onPress={async (): Promise<void> => {
                    navigation.navigate(Routes.ZxNftDetail, {
                      nonce: order.nonce,
                    })
                  }}>
                  <NftRenderer
                    tokenId={order.erc721TokenId}
                    nftContract={order.erc721Token}
                    width={150}
                    height={150}
                  />
                </TouchableOpacity>
              )
            }}
          />
        </View>
      </Container>
    </ScrollView>
  )
}

const ChannelListingsScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.ChannelListings>()

  return (
    <Container style={styles.container}>
      <Header
        title="Channel Listed NFTs"
        left={
          <Icon name="ios-chevron-back" color={COLOR.gray._800} size={20} />
        }
        onPressLeft={navigation.goBack}
      />
      <Contents channelUrl={params.channelUrl} />
    </Container>
  )
}

export default ChannelListingsScreen

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { flex: 1 },
})
