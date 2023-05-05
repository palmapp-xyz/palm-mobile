import { Container, Header } from 'components'
import useAuth from 'hooks/auth/useAuth'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useZxBuyNft from 'hooks/zx/useZxBuyNft'
import useZxCancelNft from 'hooks/zx/useZxCancelNft'
import useZxOrder from 'hooks/zx/useZxOrder'
import { Routes, navigationRef } from 'libs/navigation'
import { nftUriFetcher } from 'libs/nft'
import { stringifySendFileData } from 'libs/sendbird'
import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import { useQueryClient } from 'react-query'
import { ContractAddr, NftType, QueryKeyEnum } from 'types'

import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import { useSendbirdChat } from '@sendbird/uikit-react-native'
import { Maybe } from '@toruslabs/openlogin'

import NftDetails from './NftDetails'

const ZxNftDetailScreen = (): ReactElement => {
  const {
    navigation,
    params: { nonce, channelUrl, chain, item },
  } = useAppNavigation<Routes.ZxNftDetail>()
  const { order } = useZxOrder({ nonce, chain })

  const queryClient = useQueryClient()

  const { user } = useAuth()

  const isMine =
    order &&
    order.order.maker.toLocaleLowerCase() === user?.address.toLocaleLowerCase()

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, channelUrl || '')

  const { onClickConfirm: onClickCancel } = useZxCancelNft(
    channelUrl ?? '',
    nonce,
    chain
  )
  const { onClickConfirm: onClickBuy } = useZxBuyNft(
    channelUrl ?? '',
    nonce,
    chain
  )

  const onSubmit = async (
    nftImageUri: string | undefined,
    _metadata: Maybe<string>
  ): Promise<void> => {
    if (!order) {
      return
    }

    if (isMine) {
      await onClickCancel({ order: order.order })
    } else {
      const buyRes = await onClickBuy({ order: order.order })
      if (channel && nftImageUri && user && buyRes.success) {
        const imgInfo = await nftUriFetcher(nftImageUri)
        imgInfo.data = stringifySendFileData({
          type: 'buy',
          selectedNft: order,
          buyer: user.auth!.profileId,
        })
        channel.sendFileMessage(imgInfo)
      }
    }
    queryClient.removeQueries([QueryKeyEnum.ZX_ORDERS, chain])

    const currRoute = navigationRef.getCurrentRoute()
    if (
      Routes.ZxNftDetail === currRoute?.name &&
      // @ts-ignore
      selectedNft.order.nonce === currRoute?.params?.nonce
    ) {
      navigation.goBack()
    }
  }

  return (
    <Container style={styles.container}>
      <Header title="Buy NFT" left="back" onPressLeft={navigation.goBack} />
      {order && (
        <View>
          <NftDetails
            nftContract={order.nftToken as ContractAddr}
            tokenId={order.nftTokenId}
            type={order.nftType as NftType}
            chain={chain}
            onSubmit={onSubmit}
            item={item}
          />
        </View>
      )}
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
    padding: 10,
    justifyContent: 'space-between',
  },
  infoDetails: { rowGap: 10 },
  headText: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
})
