import React, { ReactElement, useState } from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useAsyncEffect } from '@sendbird/uikit-utils'
import firestore from '@react-native-firebase/firestore'

import { COLOR, UTIL } from 'consts'
import { ContractAddr, FbListing } from 'types'
import { Container, Header, NftRenderer } from 'components'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import useNft from 'hooks/contract/useNft'
import useAuth from 'hooks/independent/useAuth'
import GroupChannelItem from 'components/GroupChannelItem'

const Contents = ({
  nftContract,
  tokenId,
}: {
  nftContract: ContractAddr
  tokenId: string
}): ReactElement => {
  const { ownerOf } = useNft({ nftContract })
  const [tokenOwner, setTokenOwner] = useState<ContractAddr>()
  const { user } = useAuth()
  const size = useWindowDimensions()

  const isMine =
    tokenOwner?.toLocaleLowerCase() === user?.address.toLocaleLowerCase()

  const [activeListedChannels, setActiveListedChannels] = useState<FbListing[]>(
    []
  )

  useAsyncEffect(async (): Promise<void> => {
    const owner = await ownerOf({ tokenId })
    setTokenOwner(owner)

    const activeListings: FbListing[] = []
    try {
      await firestore()
        .collection('listings')
        .doc(nftContract)
        .collection('orders')
        .get()
        .then(ordersSnapshot => {
          ordersSnapshot.forEach(orderSnapshot => {
            const listing = orderSnapshot.data() as FbListing
            if (
              listing.order &&
              listing.status === 'active' &&
              listing.channelUrl
            ) {
              activeListings.push(listing)
            }
          })
        })

      setActiveListedChannels(activeListings)
    } catch (e) {
      console.error(e)
    }
  }, [nftContract, tokenId])

  return (
    <View style={styles.body}>
      <View style={styles.imageBox}>
        <NftRenderer
          tokenId={tokenId}
          nftContract={nftContract}
          style={{ flex: 1 }}
        />
      </View>
      <View style={styles.info}>
        <View style={styles.infoDetails}>
          {tokenOwner && (
            <View>
              <Text style={styles.headText}>Owner</Text>
              <Text>{isMine ? 'Mine' : UTIL.truncate(tokenOwner)}</Text>
            </View>
          )}
          <View>
            <Text style={styles.headText}>Token Contract</Text>
            <Text>{nftContract}</Text>
          </View>
          <View>
            <Text style={styles.headText}>Token ID</Text>
            <Text>{tokenId}</Text>
          </View>
          {isMine && (
            <View>
              <Text style={styles.headText}>
                Active Listings ({activeListedChannels.length})
              </Text>
              {activeListedChannels.length > 0 ? (
                <FlatList
                  data={activeListedChannels}
                  keyExtractor={(_, index): string => `active-listing-${index}`}
                  renderItem={({ item }): ReactElement => {
                    return <GroupChannelItem channelUrl={item.channelUrl} />
                  }}
                />
              ) : (
                <Text>None</Text>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

const NftDetailScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.NftDetail>()

  return (
    <Container style={styles.container}>
      <Header
        title="NFT Info"
        left={
          <Icon name="ios-chevron-back" color={COLOR.gray._800} size={20} />
        }
        onPressLeft={navigation.goBack}
      />
      <Contents nftContract={params.nftContract} tokenId={params.tokenId} />
    </Container>
  )
}

export default NftDetailScreen

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: {
    flex: 1,
    justifyContent: 'space-between',
  },
  imageBox: { width: '100%', height: 250, marginVertical: 10 },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  infoDetails: { rowGap: 10 },
  headText: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
})
