import MoralisNftRenderer from 'components/moralis/MoralisNftRenderer'
import { COLOR } from 'consts'
import useCollectionNfts from 'hooks/api/useCollectionNfts'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import { chainIdToSupportedNetworkEnum } from 'libs/utils'
import React, { ReactElement } from 'react'
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native'
import { ContractAddr, Moralis, SupportedNetworkEnum } from 'types'

import ChainLogoWrapper from './ChainLogoWrapper'
import NftItemMenu from './NftItemMenu'

const CollectionNftItems = ({
  userAddress,
  contractAddress,
  selectedNetwork,
  onNftMenuSelected,
}: {
  userAddress?: ContractAddr
  contractAddress: ContractAddr
  selectedNetwork: SupportedNetworkEnum
  onNftMenuSelected?: (
    selectedItem: Moralis.NftItem,
    selectedOption: string
  ) => Promise<void>
}): ReactElement => {
  const { navigation } = useAppNavigation()
  const size = useWindowDimensions()

  const { items, fetchNextPage, hasNextPage, isLoading } = useCollectionNfts({
    selectedNetwork,
    userAddress,
    contractAddress,
  })

  const gap = 4
  const dim = (size.width - gap) / 2.0
  if (!userAddress || isLoading) {
    return <ActivityIndicator size="small" color={COLOR.primary._400} />
  }

  return (
    <FlatList
      data={items.filter(x => !!x)}
      keyExtractor={(item): string => `${item.token_address}:${item.token_id}`}
      numColumns={2}
      contentContainerStyle={{ rowGap: gap }}
      columnWrapperStyle={{ columnGap: gap / 2, paddingHorizontal: gap / 2 }}
      onEndReached={(): void => {
        if (hasNextPage) {
          fetchNextPage()
        }
      }}
      onEndReachedThreshold={0.5}
      initialNumToRender={10}
      renderItem={({ item }): ReactElement => (
        <TouchableWithoutFeedback
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
          <View style={{ borderRadius: 10, flex: 1 }}>
            <ChainLogoWrapper
              chain={selectedNetwork}
              containerStyle={{ width: dim, height: dim }}
            >
              <MoralisNftRenderer item={item} />
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
        </TouchableWithoutFeedback>
      )}
    />
  )
}

export default CollectionNftItems

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
})
