import GroupChannelItem from 'components/GroupChannelItem'
import { getActiveListings } from 'palm-core/firebase/listing'
import { ContractAddr, FbListing } from 'palm-core/types'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleProp, Text, View, ViewStyle } from 'react-native'

import { useAsyncEffect } from '@sendbird/uikit-utils'

const NftListingChannels = ({
  nftContract,
  tokenId,
  containerStyle,
}: {
  nftContract: ContractAddr
  tokenId: string
  containerStyle?: StyleProp<ViewStyle>
}): ReactElement => {
  const { t } = useTranslation()
  const [activeListedChannels, setActiveListedChannels] = useState<FbListing[]>(
    []
  )

  useAsyncEffect(async (): Promise<void> => {
    const activeListings: FbListing[] = await getActiveListings(
      nftContract,
      tokenId
    )
    setActiveListedChannels(activeListings)
  }, [nftContract])

  return activeListedChannels.length > 0 ? (
    <FlatList
      contentContainerStyle={[{ gap: 10, marginVertical: 10 }, containerStyle]}
      scrollEnabled={false}
      data={activeListedChannels}
      keyExtractor={(_, index): string => `active-listing-${index}`}
      renderItem={({ item }): ReactElement => {
        return <GroupChannelItem channelUrl={item.channelUrl} />
      }}
    />
  ) : (
    <View style={containerStyle}>
      <Text>{t('Common.Done')}</Text>
    </View>
  )
}

export default NftListingChannels
