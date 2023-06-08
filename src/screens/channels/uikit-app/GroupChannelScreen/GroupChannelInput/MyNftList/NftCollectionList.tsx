import { FormText } from 'components'
import Indicator from 'components/atoms/Indicator'
import { COLOR } from 'consts'
import useUserNftCollectionList from 'hooks/api/useUserNftCollectionList'
import { UseGcInputReturn } from 'hooks/page/groupChannel/useGcInput'
import React, { ReactElement } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import { ContractAddr } from 'types'

const NftCollectionList = ({
  useGcInputReturn,
  userAddress,
}: {
  useGcInputReturn: UseGcInputReturn
  userAddress?: ContractAddr
}): ReactElement => {
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
        <Text style={styles.text}>{'No tokens to show'}</Text>
      ) : (
        <Text style={styles.text}>{'End of List'}</Text>
      )}
    </View>
  )

  return (
    <FlatList
      data={items}
      ListFooterComponent={listFooterComponent}
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
      renderItem={({ item }): ReactElement => (
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
      )}
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
  text: {
    color: 'gray',
    fontSize: 12,
    textAlign: 'center',
  },
})
