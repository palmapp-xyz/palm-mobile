import {
  ChainLogoWrapper,
  FormBottomSheet,
  FormText,
  MoralisNftRenderer,
  NftItemMenu,
} from 'components'
import { COLOR } from 'consts'
import useCollectionNfts from 'hooks/api/useCollectionNfts'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import { chainIdToSupportedNetworkEnum } from 'libs/utils'
import React, { ReactElement, useMemo } from 'react'
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native'
import { ContractAddr, Moralis, SupportedNetworkEnum } from 'types'

const SelectedCollectionNftsSheet = ({
  userAddress,
  selectedCollectionNft,
  onNftMenuSelected,
  onClose,
}: {
  userAddress: ContractAddr
  selectedCollectionNft: Moralis.NftCollection
  onNftMenuSelected?: (
    selectedItem: Moralis.NftItem,
    selectedOption: string
  ) => Promise<void>
  onClose: () => void
}): ReactElement => {
  const snapPoints = useMemo(() => ['80%'], [])

  const { navigation } = useAppNavigation()
  const size = useWindowDimensions()
  const dim = size.width / 3.0 - 18

  const selectedNetwork =
    chainIdToSupportedNetworkEnum(selectedCollectionNft.chainId || '0x1') ||
    SupportedNetworkEnum.ETHEREUM

  const { items, loading } = useCollectionNfts({
    selectedNetwork,
    userAddress,
    contractAddress: selectedCollectionNft.token_address,
  })

  if (loading) {
    return <ActivityIndicator size="small" color={COLOR.primary._400} />
  }

  const listHeaderComponent = (
    <FormText fontType={'B.14'} style={{ marginBottom: 12, marginStart: 6 }}>
      {selectedCollectionNft.name}
    </FormText>
  )

  const listFooterComponent = (
    <View style={{ paddingTop: 16 }}>
      {loading ? (
        <ActivityIndicator color={COLOR.primary._400} />
      ) : items.length === 0 ? (
        <Text style={styles.text}>{'No tokens to show'}</Text>
      ) : (
        <Text style={styles.text}>{'End of List'}</Text>
      )}
    </View>
  )

  return (
    <FormBottomSheet
      showBottomSheet={true}
      snapPoints={snapPoints}
      onClose={onClose}
      backgroundStyle={{
        backgroundColor: COLOR.black._10,
      }}
    >
      <View style={{ flex: 1 }}>
        <View style={styles.body}>
          <FlatList
            data={items}
            ListHeaderComponent={listHeaderComponent}
            ListFooterComponent={listFooterComponent}
            keyExtractor={(_, index): string => `user-ft-list-${index}`}
            initialNumToRender={10}
            contentContainerStyle={{ rowGap: 0 }}
            numColumns={3}
            renderItem={({ item }): ReactElement => (
              <TouchableOpacity
                onPress={(): void => {
                  navigation.navigate(Routes.NftDetail, {
                    nftContract: item.token_address,
                    tokenId: item.token_id,
                    nftContractType: item.contract_type,
                    chain:
                      chainIdToSupportedNetworkEnum(item.chainId || '0x1') ||
                      SupportedNetworkEnum.ETHEREUM,
                    item,
                  })
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
                    <MoralisNftRenderer
                      style={{ borderRadius: 12 }}
                      item={item}
                    />
                    {onNftMenuSelected && (
                      <NftItemMenu
                        chainId={selectedNetwork}
                        item={item}
                        triggerComponent={
                          <View style={styles.nftTitle}>
                            <Text numberOfLines={1}>{`#${item.token_id}`}</Text>
                          </View>
                        }
                        onSelect={onNftMenuSelected}
                      />
                    )}
                  </ChainLogoWrapper>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </FormBottomSheet>
  )
}

export default SelectedCollectionNftsSheet

const styles = StyleSheet.create({
  body: { flex: 1, padding: 20, backgroundColor: 'white', gap: 20 },
  itemCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLOR.black._90005,
    borderRadius: 16,
  },
  text: {
    color: 'gray',
    fontSize: 12,
    textAlign: 'center',
  },
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
})