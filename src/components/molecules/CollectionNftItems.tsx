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

  const { items, fetchNextPage, hasNextPage, loading } = useCollectionNfts({
    selectedNetwork,
    userAddress,
    contractAddress,
  })

  const dim = size.width / 2.0 - 32
  if (!userAddress || loading) {
    return <ActivityIndicator size="small" color={COLOR.primary._400} />
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item): string => `${item.token_address}:${item.token_id}`}
      numColumns={2}
      onEndReached={(): void => {
        if (hasNextPage) {
          fetchNextPage()
        }
      }}
      onEndReachedThreshold={0.5}
      initialNumToRender={10}
      renderItem={({ item }): ReactElement => (
        <View
          style={{ flex: 1, alignItems: 'center' }}
          onTouchEnd={(): void => {
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
          <ChainLogoWrapper
            chain={selectedNetwork}
            containerStyle={[
              { width: dim, height: dim },
              styles.item,
              { maxWidth: dim },
            ]}
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
      )}
    />
  )
}

export default CollectionNftItems

const styles = StyleSheet.create({
  item: {
    margin: 4,
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
