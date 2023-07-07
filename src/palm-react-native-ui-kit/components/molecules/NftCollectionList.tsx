import { COLOR } from 'palm-core/consts'
import { ContractAddr, Moralis, SupportedNetworkEnum } from 'palm-core/types'
import useCollectionNfts from 'palm-react/hooks/api/useCollectionNfts'
import React, { ReactElement } from 'react'
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native'
import FormText from '../atoms/FormText'
import Indicator from '../atoms/Indicator'
import MoralisNftRenderer from '../moralis/MoralisNftRenderer'
import ChainLogoWrapper from './ChainLogoWrapper'

const NftCollectionList = ({
  selectedNetwork,
  address,
  selectedCollectionNft,
  layoutHeight,
  setSelectedItem,
  selectedItem,
}: {
  selectedNetwork: SupportedNetworkEnum
  address: ContractAddr
  selectedCollectionNft: Moralis.NftCollection | null
  layoutHeight: number
  setSelectedItem: React.Dispatch<React.SetStateAction<Moralis.NftItem | null>>
  selectedItem: Moralis.NftItem | null
}): ReactElement => {
  const size = useWindowDimensions()
  const dim = size.width / 3.0 - 18

  const { items, loading, fetchNextPage, hasNextPage } = useCollectionNfts({
    selectedNetwork,
    userAddress: address,
    contractAddress: selectedCollectionNft?.token_address!,
    preload: selectedCollectionNft?.preload,
  })
  const loadingIndicator = loading ? <Indicator /> : null

  return (
    <FlatList
      data={items}
      keyExtractor={(_, index): string => `select-user-ft-list-${index}`}
      initialNumToRender={10}
      contentContainerStyle={{ rowGap: 0 }}
      numColumns={3}
      onEndReached={(): void => {
        if (hasNextPage) {
          fetchNextPage()
        }
      }}
      ListFooterComponent={loadingIndicator}
      style={{ marginHorizontal: 16, marginBottom: layoutHeight }}
      renderItem={({ item }): ReactElement => (
        <TouchableOpacity
          onPress={(): void => {
            setSelectedItem(item)
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              margin: 2,
            }}
          >
            <ChainLogoWrapper
              chain={selectedNetwork}
              containerStyle={{
                width: dim,
                height: dim,
                maxWidth: dim,
              }}
            >
              <MoralisNftRenderer style={{ borderRadius: 12 }} item={item} />
              <View
                style={[
                  styles.selectItemIcon,
                  {
                    backgroundColor:
                      selectedItem && selectedItem.token_id === item.token_id
                        ? COLOR.primary._400
                        : 'white',
                  },
                ]}
              >
                {selectedItem && selectedItem.token_id === item.token_id && (
                  <FormText font={'B'} color="white">
                    {'✓'}
                  </FormText>
                )}
              </View>
              <View style={styles.nftTitle}>
                <FormText numberOfLines={1}>{`#${item.token_id}`}</FormText>
              </View>
            </ChainLogoWrapper>
          </View>
        </TouchableOpacity>
      )}
    />
  )
}
export default NftCollectionList

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
    flex: 1,
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
})
