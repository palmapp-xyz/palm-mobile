import Indicator from 'components/atoms/Indicator'
import ProfileCollectionNft from 'components/molecules/ProfileCollectionNft'
import { ContractAddr } from 'core/types'
import useUserNftCollectionList from 'hooks/api/useUserNftCollectionList'
import { UseGcInputReturn } from 'hooks/page/groupChannel/useGcInput'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

const NftCollectionList = ({
  useGcInputReturn,
  userAddress,
}: {
  useGcInputReturn: UseGcInputReturn
  userAddress?: ContractAddr
}): ReactElement => {
  const { t } = useTranslation()
  const { selectedNetwork, setSelectedCollection } = useGcInputReturn

  const { items, fetchNextPage, hasNextPage, loading } =
    useUserNftCollectionList({
      userAddress,
      selectedNetwork,
    })

  const listFooterComponent = (
    <View style={{ paddingTop: 16 }}>
      {loading ? (
        <Indicator />
      ) : items.length === 0 ? (
        <Text style={styles.text}>{t('Channels.UiKitNftNoToken')}</Text>
      ) : (
        <Text style={styles.text}>{t('Channels.UiKitNftEndOfList')}</Text>
      )}
    </View>
  )

  return (
    <FlatList
      data={items}
      ListFooterComponent={listFooterComponent}
      keyExtractor={(_, index): string => `useUserNftCollectionList-${index}`}
      style={{ paddingHorizontal: 8, paddingTop: 20 }}
      contentContainerStyle={{ gap: 4 }}
      columnWrapperStyle={{ gap: 8 }}
      numColumns={2}
      onEndReached={(): void => {
        if (hasNextPage) {
          fetchNextPage()
        }
      }}
      onEndReachedThreshold={0.5}
      initialNumToRender={10}
      renderItem={({ item }): ReactElement => (
        <ProfileCollectionNft
          collection={item}
          onSelect={(): void => setSelectedCollection(item)}
        />
      )}
    />
  )
}

export default NftCollectionList

const styles = StyleSheet.create({
  text: {
    color: 'gray',
    fontSize: 12,
    textAlign: 'center',
  },
})
