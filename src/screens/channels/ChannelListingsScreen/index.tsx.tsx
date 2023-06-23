import { Container, FormButton, FormText, Header } from 'components'
import { COLOR } from 'consts'
import useFsChannel from 'hooks/firestore/useFsChannel'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { recordError } from 'libs/logger'
import { Routes } from 'libs/navigation'
import React, { ReactElement, useState } from 'react'
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native'
import { FbListing } from 'types'

import { useAsyncEffect } from '@sendbird/uikit-utils'

import { useTranslation } from 'react-i18next'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FbListingItem from './FbListingItem'

const Contents = ({ channelUrl }: { channelUrl: string }): ReactElement => {
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [channelListings, setChannelListings] = useState<FbListing[]>([])

  const { navigation } = useAppNavigation<Routes.ChannelListings>()
  const { fsChannel } = useFsChannel({ channelUrl })
  const { t } = useTranslation()

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
      recordError(e, 'getChannelListings')
    }
  }, [fsChannel, isFetching])

  if (!fsChannel || (!isFetching && channelListings.length === 0)) {
    return (
      <SafeAreaView style={styles.empty}>
        <Ionicons
          name="alert-circle-outline"
          size={44}
          color={COLOR.black._300}
          style={{ margin: 20 }}
        />
        <FormText
          font={'B'}
          size={18}
          color={COLOR.black._900}
          style={{ textAlign: 'center' }}
        >
          {t('Nft.ChannelListingNoListedNft')}
        </FormText>
        <FormButton
          figure="outline"
          containerStyle={styles.buttonListNft}
          textStyle={{ color: COLOR.black._300 }}
          rightIcon="ios-chevron-forward"
          onPress={(): void => {
            // navigation.navigate(Routes.ListNft, { channelUrl })
          }}
        >
          {t('Nft.ChannelListingListNFT')}
        </FormButton>
      </SafeAreaView>
    )
  }

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
            <FbListingItem item={item} channelUrl={channelUrl} />
          </View>
        )}
      />
    </View>
  )
}

const ChannelListingsScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.ChannelListings>()

  return (
    <Container
      style={styles.container}
      safeAreaBackgroundColor={COLOR.black._10}
    >
      <Header
        right="close"
        onPressRight={navigation.goBack}
        containerStyle={{ backgroundColor: 'transparent' }}
      />
      <Contents channelUrl={params.channelUrl} />
    </Container>
  )
}

export default ChannelListingsScreen

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  body: { flex: 1 },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonListNft: {
    flexDirection: 'row',
    borderColor: COLOR.black._100,
    borderRadius: 12,
    margin: 36,
    paddingLeft: 20,
    paddingRight: 14,
    paddingVertical: 4,
  },
})
