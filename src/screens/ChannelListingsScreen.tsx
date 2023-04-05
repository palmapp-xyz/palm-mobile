import React, { ReactElement, useState } from 'react'
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useAsyncEffect } from '@sendbird/uikit-utils'

import { COLOR } from 'consts'

import { Container, Header } from 'components'

import { useAppNavigation } from 'hooks/useAppNavigation'
import useFsChannel from 'hooks/firestore/useFsChannel'
import { Routes } from 'libs/navigation'

import { FbListing } from 'types'
import FbListingItem from 'components/fbListing/FbListingItem'

const Contents = ({ channelUrl }: { channelUrl: string }): ReactElement => {
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
    <View style={styles.body}>
      <FlatList
        data={channelListings}
        overScrollMode="auto"
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={(): void => {
              setIsFetching(true)
            }}
          />
        }
        refreshing={isFetching}
        keyExtractor={(_, index): string => `listing-${index}`}
        numColumns={2}
        scrollEnabled
        style={{
          paddingHorizontal: 20,
          paddingTop: 20,
        }}
        contentContainerStyle={{ gap: 10 }}
        columnWrapperStyle={{ gap: 10 }}
        renderItem={({ item }): ReactElement => (
          <View style={{ flex: 1 / 2 }}>
            <FbListingItem item={item} />
          </View>
        )}
      />
    </View>
  )
}

const ChannelListingsScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.ChannelListings>()

  return (
    <Container style={styles.container}>
      <Header
        title="NFT List"
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
