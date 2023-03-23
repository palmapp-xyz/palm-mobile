import React, { ReactElement, useState } from 'react'
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useAsyncEffect } from '@sendbird/uikit-utils'
import firestore from '@react-native-firebase/firestore'

import { COLOR } from 'consts'
import { ContractAddr, FbListing, SupportedNetworkEnum } from 'types'
import { Container, Header, LinkExplorer } from 'components'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import useNft from 'hooks/contract/useNft'
import useAuth from 'hooks/independent/useAuth'
import GroupChannelItem from 'components/GroupChannelItem'
import NftMetadata from 'components/molecules/NftMetadata'
import useNftImage from 'hooks/independent/useNftImage'
import { MediaRendererProps } from 'components/atoms/MediaRenderer'
import NftMediaRenderer from 'components/molecules/NftMediaRenderer'

const Contents = ({
  nftContract,
  tokenId,
  chain,
}: {
  nftContract: ContractAddr
  tokenId: string
  chain: SupportedNetworkEnum
}): ReactElement => {
  const { ownerOf } = useNft({ nftContract })
  const [tokenOwner, setTokenOwner] = useState<ContractAddr>()
  const { user } = useAuth()

  const isMine =
    tokenOwner?.toLocaleLowerCase() === user?.address.toLocaleLowerCase()

  const [activeListedChannels, setActiveListedChannels] = useState<FbListing[]>(
    []
  )

  const { loading, uri, metadata } = useNftImage({
    nftContract,
    tokenId,
  })

  const nftRenderProps: MediaRendererProps = {
    src: uri,
    alt: `${nftContract}:${tokenId}`,
    loading,
    metadata,
    style: { flex: 1 },
  }

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
    <ScrollView>
      <View style={styles.body}>
        <View style={styles.imageBox}>
          <NftMediaRenderer {...nftRenderProps} />
        </View>
        <View style={styles.info}>
          <View style={styles.infoDetails}>
            {tokenOwner && (
              <View style={styles.item}>
                <Text style={styles.headText}>Owner</Text>
                <LinkExplorer
                  type="address"
                  address={tokenOwner}
                  network={chain}
                />
              </View>
            )}
            <View style={styles.item}>
              <Text style={styles.headText}>Token Contract</Text>
              <LinkExplorer
                type="address"
                address={nftContract}
                network={chain}
              />
            </View>
            <View style={styles.item}>
              <Text style={styles.headText}>Token ID</Text>
              <Text>{tokenId}</Text>
            </View>
            <NftMetadata metadata={metadata} style={styles.item} />
            {isMine && (
              <View style={styles.item}>
                <Text style={styles.headText}>
                  Active Listings ({activeListedChannels.length})
                </Text>
                {activeListedChannels.length > 0 ? (
                  <FlatList
                    scrollEnabled={false}
                    data={activeListedChannels}
                    keyExtractor={(_, index): string =>
                      `active-listing-${index}`
                    }
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
    </ScrollView>
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
      <Contents
        nftContract={params.nftContract}
        tokenId={params.tokenId}
        chain={params.chain}
      />
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
  item: {
    marginVertical: 3,
  },
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
