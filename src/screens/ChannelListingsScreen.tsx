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
import { useAsyncEffect } from '@sendbird/uikit-utils'

import { FbListing } from 'types'
import Icon from 'react-native-vector-icons/Ionicons'
import { COLOR } from 'consts'
import useFsChannel from 'hooks/firestore/useFsChannel'
import { getOrderTokenAddress, getOrderTokenId } from 'libs/zx'

const Contents = ({ channelUrl }: { channelUrl: string }): ReactElement => {
  const { navigation } = useAppNavigation<Routes.ChannelListings>()

  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [channelListings, setChannelListings] = useState<FbListing[]>([])

  const { fsChannel } = useFsChannel({ channelUrl })

  useAsyncEffect(async () => {
    if (!fsChannel) {
      return
    }

    try {
      // add the new listing item to the corresponding channel doc firestore
      const listings: FbListing[] = []
      await fsChannel
        .collection('listings')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            const listing = documentSnapshot.data() as FbListing
            if (listing.order && listing.status === 'active') {
              listings.push(listing)
            }
          })
        })
      setChannelListings(listings)
      setIsFetching(false)
    } catch (e) {
      console.error(e)
    }
  }, [fsChannel, isFetching])

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
            data={channelListings}
            keyExtractor={(_, index): string => `listing-${index}`}
            numColumns={2}
            scrollEnabled={false}
            style={{ paddingHorizontal: 20 }}
            contentContainerStyle={{ gap: 10 }}
            columnWrapperStyle={{ gap: 10 }}
            renderItem={({ item: listing }): ReactElement => {
              return (
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    flex: 1,
                    justifyContent: 'center',
                  }}
                  onPress={async (): Promise<void> => {
                    navigation.navigate(Routes.ZxNftDetail, {
                      nonce: listing.order.nonce,
                      chain: listing.chain,
                    })
                  }}>
                  <NftRenderer
                    tokenId={getOrderTokenId(listing.order)}
                    nftContract={getOrderTokenAddress(listing.order)}
                    width={150}
                    height={150}
                    chain={listing.chain}
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
