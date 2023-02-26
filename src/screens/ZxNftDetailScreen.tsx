import React, { ReactElement } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from '@sendbird/uikit-react-native-foundation'
import { useQueryClient } from 'react-query'

import { UTIL } from 'consts'
import { QueryKeyEnum, zx } from 'types'
import { Container, Header, NftRenderer, SubmitButton } from 'components'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useAuth from 'hooks/independent/useAuth'
import useZxCancelNft from 'hooks/zx/useZxCancelNft'
import useZxBuyNft from 'hooks/zx/useZxBuyNft'
import { navigationRef, Routes } from 'libs/navigation'
import useZxOrder from 'hooks/zx/useZxOrder'

const Contents = ({ selectedNft }: { selectedNft: zx.order }): ReactElement => {
  const { user } = useAuth()
  const isMine =
    selectedNft.order.maker.toLocaleLowerCase() ===
    user?.address.toLocaleLowerCase()
  const { navigation } = useAppNavigation()

  const { onClickConfirm: onClickCancel } = useZxCancelNft()

  const { onClickConfirm: onClickBuy } = useZxBuyNft()

  const queryClient = useQueryClient()

  return (
    <View style={styles.body}>
      <View style={styles.imageBox}>
        <View style={{ height: 250 }}>
          <NftRenderer
            tokenId={selectedNft.order.erc721TokenId}
            nftContract={selectedNft.order.erc721Token}
          />
        </View>
      </View>
      <View style={styles.info}>
        <View style={styles.infoDetails}>
          <View>
            <Text>Owner</Text>
            <Text>
              {isMine ? 'Mine' : UTIL.truncate(selectedNft.order.maker)}
            </Text>
          </View>
          <View>
            <Text>Token</Text>
            <Text>{selectedNft.order.erc721Token}</Text>
          </View>
          <View>
            <Text>Price</Text>
            <Text>{UTIL.formatAmountP(selectedNft.erc20TokenAmount)} ETH</Text>
          </View>
        </View>
        <SubmitButton
          onPress={async (): Promise<void> => {
            isMine
              ? await onClickCancel({ nonce: selectedNft.order.nonce })
              : await onClickBuy({ order: selectedNft.order })
            queryClient.removeQueries([QueryKeyEnum.ZX_ORDERS])

            const currRoute = navigationRef.getCurrentRoute()
            if (
              Routes.ZxNftDetail === currRoute?.name &&
              // @ts-ignore
              selectedNft.order.nonce === currRoute?.params?.nonce
            ) {
              navigation.goBack()
            }
          }}>
          {isMine ? 'Cancel' : 'Buy'}
        </SubmitButton>
      </View>
    </View>
  )
}

const ZxNftDetailScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.ZxNftDetail>()
  const { order } = useZxOrder({ nonce: params.nonce })

  return (
    <Container style={styles.container}>
      <Header
        title="Trader.xyz NFT"
        left={<Icon icon={'arrow-left'} />}
        onPressLeft={(): void => {
          navigation.goBack()
        }}
      />
      {order && <Contents selectedNft={order} />}
    </Container>
  )
}

export default ZxNftDetailScreen

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: {
    flex: 1,
    justifyContent: 'space-between',
  },
  imageBox: { width: '100%' },
  info: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  infoDetails: { rowGap: 10 },
})
