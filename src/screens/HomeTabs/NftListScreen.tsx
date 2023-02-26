import React, { ReactElement } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'

import { Container, Header, NftRenderer } from 'components'

import useZxOrders from 'hooks/zx/useZxOrders'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'

const NftListScreen = (): ReactElement => {
  const { orderList } = useZxOrders()
  const { navigation } = useAppNavigation()

  return (
    <Container style={styles.container}>
      <Header title="Trader.xyz NFTs" />
      <View style={styles.body}>
        <FlatList
          data={orderList}
          keyExtractor={(_, index): string => `orderList-${index}`}
          numColumns={2}
          style={{ paddingHorizontal: 20 }}
          contentContainerStyle={{ gap: 10 }}
          columnWrapperStyle={{ gap: 10 }}
          renderItem={({ item }): ReactElement => {
            return (
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: 'white',
                  height: 100,
                }}
                onPress={async (): Promise<void> => {
                  navigation.navigate(Routes.ZxNftDetail, {
                    nonce: item.order.nonce,
                  })
                }}>
                <NftRenderer
                  tokenId={item.order.erc721TokenId}
                  nftContract={item.order.erc721Token}
                />
              </TouchableOpacity>
            )
          }}
        />
      </View>
    </Container>
  )
}

export default NftListScreen

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { flex: 1 },
})
