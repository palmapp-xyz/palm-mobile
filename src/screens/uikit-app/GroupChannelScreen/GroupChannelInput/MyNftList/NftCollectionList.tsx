import { FormText } from 'components'
import { COLOR } from 'consts'
import useUserNftCollectionList from 'hooks/api/useUserNftCollectionList'
import React, { ReactElement } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import { ContractAddr, Moralis, SupportedNetworkEnum } from 'types'

const NftCollectionList = ({
  setSelectedCollection,
  userAddress,
  selectedNetwork,
}: {
  setSelectedCollection: React.Dispatch<
    React.SetStateAction<Moralis.NftCollection | undefined>
  >
  userAddress?: ContractAddr
  selectedNetwork: SupportedNetworkEnum
}): ReactElement => {
  const { items, fetchNextPage, hasNextPage, isLoading } =
    useUserNftCollectionList({
      userAddress,
      selectedNetwork,
    })

  return (
    <FlatList
      data={items}
      ListEmptyComponent={(): ReactElement =>
        isLoading ? (
          <View style={{ paddingTop: 16 }}>
            <ActivityIndicator color={COLOR.primary._400} />
          </View>
        ) : (
          <View style={styles.emptyBox}>
            <FormText>{'The user has no NFTs yet.'}</FormText>
          </View>
        )
      }
      keyExtractor={(_, index): string => `useUserNftCollectionList-${index}`}
      style={{ paddingHorizontal: 8, paddingTop: 20 }}
      contentContainerStyle={{ gap: 8 }}
      columnWrapperStyle={{ gap: 8 }}
      numColumns={2}
      onEndReached={(): void => {
        if (hasNextPage) {
          fetchNextPage()
        }
      }}
      onEndReachedThreshold={0.5}
      initialNumToRender={10}
      renderItem={({ item }): ReactElement => {
        return (
          <View style={{ flex: 1 / 2 }}>
            <TouchableOpacity
              onPress={(): void => {
                setSelectedCollection(item)
              }}
            >
              <View style={styles.nftTitle}>
                <FormText
                  numberOfLines={1}
                  fontType="B.16"
                >{`#${item.name}`}</FormText>
              </View>
            </TouchableOpacity>
          </View>
        )
      }}
    />
  )
}

export default NftCollectionList

const styles = StyleSheet.create({
  nftTitle: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderWidth: 1,
    borderRadius: 14,
    borderColor: COLOR.black._200,
    alignItems: 'center',
  },
  emptyBox: {
    gap: 20,
    padding: 10,
  },
})
