import React, { ReactElement } from 'react'
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import { Container, Header, NftRenderer } from 'components'

import useZxOrders from 'hooks/zx/useZxOrders'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import { chainIdToSupportedNetworkEnum } from 'libs/utils'
import { ContractAddr, NftType, SupportedNetworkEnum } from 'types'

const NftListScreen = ({
  chain,
}: {
  chain: SupportedNetworkEnum
}): ReactElement => {
  const { orderList, refetch, remove, isFetching } = useZxOrders(chain)
  const { navigation } = useAppNavigation()

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={isFetching}
          onRefresh={(): void => {
            remove()
            refetch()
          }}
        />
      }>
      <Container style={styles.container}>
        <Header title="Listed NFTs" />
        <View style={styles.body}>
          <FlatList
            data={orderList}
            keyExtractor={(_, index): string => `orderList-${index}`}
            numColumns={2}
            scrollEnabled={false}
            style={{ paddingHorizontal: 20 }}
            contentContainerStyle={{ gap: 10 }}
            columnWrapperStyle={{ gap: 10 }}
            renderItem={({ item }): ReactElement => {
              return (
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    flex: 1,
                    justifyContent: 'center',
                  }}
                  onPress={async (): Promise<void> => {
                    navigation.navigate(Routes.ZxNftDetail, {
                      nonce: item.order.nonce,
                      chain:
                        chainIdToSupportedNetworkEnum(item.chainId || '0x1') ||
                        SupportedNetworkEnum.ETHEREUM,
                    })
                  }}>
                  <NftRenderer
                    tokenId={item.nftTokenId}
                    nftContract={item.nftToken as ContractAddr}
                    type={item.nftType as NftType}
                    width={150}
                    height={150}
                    chain={chain}
                  />
                </TouchableOpacity>
              )
            }}
          />
        </View>
      </Container>
    </ScrollView>
  )
}

export default NftListScreen

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { flex: 1 },
})
