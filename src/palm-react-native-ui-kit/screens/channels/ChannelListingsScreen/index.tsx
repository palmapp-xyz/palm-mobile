import { COLOR } from 'palm-core/consts'
import { onChannelListings } from 'palm-core/firebase/channel'
import { recordError } from 'palm-core/libs/logger'
import { Routes } from 'palm-core/libs/navigation'
import { FbListing } from 'palm-core/types'
import {
  Container,
  FormText,
  Header,
} from 'palm-react-native-ui-kit/components'
import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import FbListingItem from './FbListingItem'

const Contents = ({ channelUrl }: { channelUrl: string }): ReactElement => {
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [channelListings, setChannelListings] = useState<FbListing[]>([])

  const { t } = useTranslation()

  useEffect(() => {
    const listings: FbListing[] = []
    const { unsubscribe } = onChannelListings(channelUrl, 'active', {
      error: e => {
        setIsFetching(false)
        recordError(e, 'getChannelListings')
      },
      next: querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (
            !documentSnapshot.exists ||
            documentSnapshot.data().status !== 'active'
          ) {
            return
          }
          listings.push(documentSnapshot.data())
        })
      },
      complete: () => {
        setChannelListings(listings)
        setIsFetching(false)
      },
    })
    return unsubscribe
  }, [])

  if (!isFetching && channelListings.length === 0) {
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
