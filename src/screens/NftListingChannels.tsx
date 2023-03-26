import React, { ReactElement, useState } from 'react'
import { FlatList, StyleProp, Text, View, ViewStyle } from 'react-native'
import { useAsyncEffect } from '@sendbird/uikit-utils'
import firestore from '@react-native-firebase/firestore'

import { ContractAddr, FbListing } from 'types'
import GroupChannelItem from 'components/GroupChannelItem'

const NftListingChannels = ({
  nftContract,
  containerStyle,
}: {
  nftContract: ContractAddr
  containerStyle?: StyleProp<ViewStyle>
}): ReactElement => {
  const [activeListedChannels, setActiveListedChannels] = useState<FbListing[]>(
    []
  )

  useAsyncEffect(async (): Promise<void> => {
    const activeListings: FbListing[] = []
    try {
      await firestore()
        .collection('listings')
        .where('nftContract', '==', nftContract)
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
  }, [nftContract])

  return activeListedChannels.length > 0 ? (
    <FlatList
      style={containerStyle}
      scrollEnabled={false}
      data={activeListedChannels}
      keyExtractor={(_, index): string => `active-listing-${index}`}
      renderItem={({ item }): ReactElement => {
        return <GroupChannelItem channelUrl={item.channelUrl} />
      }}
    />
  ) : (
    <View style={containerStyle}>
      <Text>None</Text>
    </View>
  )
}

export default NftListingChannels
