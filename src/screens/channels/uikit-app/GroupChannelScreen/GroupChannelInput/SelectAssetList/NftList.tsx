import { FormText, MoralisNftRenderer } from 'components'
import Indicator from 'components/atoms/Indicator'
import { COLOR } from 'consts'
import useCollectionNfts from 'hooks/api/useCollectionNfts'
import { UseGcInputReturn } from 'hooks/page/groupChannel/useGcInput'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'
import { ContractAddr, Moralis } from 'types'

const NftList = ({
  useGcInputReturn,
  userAddress,
  selectedCollection,
}: {
  useGcInputReturn: UseGcInputReturn
  userAddress?: ContractAddr
  selectedCollection: Moralis.NftCollection
}): ReactElement => {
  const {
    setSelectedCollection,
    selectedNetwork,
    selectedNftList,
    setSelectedNftList,
    stepAfterSelectItem,
  } = useGcInputReturn

  const { items, fetchNextPage, hasNextPage, loading } = useCollectionNfts({
    selectedNetwork,
    userAddress,
    contractAddress: selectedCollection.token_address,
  })
  const { t } = useTranslation()

  const listHeaderComponent = (
    <TouchableOpacity
      style={{
        paddingBottom: 8,
        flexDirection: 'row',
        gap: 8,
        paddingHorizontal: 12,
      }}
      onPress={(): void => {
        setSelectedCollection(undefined)
      }}
    >
      <Icon name="ios-chevron-back" color={COLOR.black._800} size={16} />
      <FormText fontType="B.12">{selectedCollection.name}</FormText>
    </TouchableOpacity>
  )

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
      ListHeaderComponent={listHeaderComponent}
      keyExtractor={(_, index): string => `nftList-${index}`}
      style={{ paddingHorizontal: 8, paddingTop: 20 }}
      contentContainerStyle={{ gap: 8 }}
      columnWrapperStyle={{ gap: 8 }}
      numColumns={3}
      onEndReached={(): void => {
        if (hasNextPage) {
          fetchNextPage()
        }
      }}
      onEndReachedThreshold={0.5}
      initialNumToRender={10}
      renderItem={({ item }): ReactElement => {
        const selectedIndex = selectedNftList.findIndex(
          x =>
            x.token_address === item.token_address &&
            (x as Moralis.NftItem).token_id === item.token_id
        )

        return (
          <View style={{ flex: 1 / 3, alignItems: 'center' }}>
            <TouchableOpacity
              onPress={(): void => {
                if (stepAfterSelectItem === 'share') {
                  setSelectedNftList(valOrUpdater => {
                    if (selectedIndex > -1) {
                      return valOrUpdater.filter(x => x !== item)
                    } else {
                      // Send up to N at a time.
                      if (selectedNftList.length < 3) {
                        return [...valOrUpdater, item]
                      } else {
                        return valOrUpdater
                      }
                    }
                  })
                } else {
                  setSelectedNftList([item])
                }
              }}
            >
              <MoralisNftRenderer item={item} width={104} height={104} />
              <View
                style={[
                  styles.selectItemIcon,
                  {
                    backgroundColor:
                      selectedIndex > -1 ? COLOR.primary._400 : 'white',
                  },
                ]}
              >
                {selectedIndex > -1 && (
                  <FormText fontType="B.12" color="white">
                    {selectedIndex + 1}
                  </FormText>
                )}
              </View>
              <View style={styles.nftTitle}>
                <FormText
                  numberOfLines={1}
                  style={{ fontSize: 10 }}
                >{`#${item.token_id}`}</FormText>
              </View>
            </TouchableOpacity>
          </View>
        )
      }}
    />
  )
}

export default NftList

const styles = StyleSheet.create({
  nftTitle: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 10,
    alignSelf: 'center',
    bottom: 0,
  },
  selectItemIcon: {
    position: 'absolute',
    top: 8,
    left: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLOR.primary._400,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'gray',
    fontSize: 12,
    textAlign: 'center',
  },
})
