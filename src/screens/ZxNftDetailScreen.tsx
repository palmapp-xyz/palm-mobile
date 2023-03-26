import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import { useQueryClient } from 'react-query'
import Icon from 'react-native-vector-icons/Ionicons'

import { Maybe } from '@toruslabs/openlogin'
import { useSendbirdChat } from '@sendbird/uikit-react-native'
import { useGroupChannel } from '@sendbird/uikit-chat-hooks'

import { COLOR } from 'consts'
import { ContractAddr, QueryKeyEnum } from 'types'
import { Container, Header } from 'components'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useAuth from 'hooks/independent/useAuth'
import useZxCancelNft from 'hooks/zx/useZxCancelNft'
import useZxBuyNft from 'hooks/zx/useZxBuyNft'
import { navigationRef, Routes } from 'libs/navigation'
import useZxOrder from 'hooks/zx/useZxOrder'
import { nftUriFetcher } from 'libs/nft'
import { stringifySendFileData } from 'libs/sendbird'
import NftDetails from './NftDetails'

const ZxNftDetailScreen = (): ReactElement => {
  const {
    navigation,
    params: { nonce, channelUrl, chain },
  } = useAppNavigation<Routes.ZxNftDetail>()
  const { order } = useZxOrder({ nonce: nonce, chain: chain })

  const queryClient = useQueryClient()

  const { user } = useAuth()

  const isMine =
    order &&
    order.order.maker.toLocaleLowerCase() === user?.address.toLocaleLowerCase()

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, channelUrl || '')

  const { onClickConfirm: onClickCancel } = useZxCancelNft(
    channelUrl ?? '',
    chain
  )
  const { onClickConfirm: onClickBuy } = useZxBuyNft(channelUrl ?? '', chain)

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
          buyer: user.address,
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
      <Header
        title="Buy NFT"
        left={
          <Icon name="ios-chevron-back" color={COLOR.gray._800} size={20} />
        }
        onPressLeft={navigation.goBack}
      />
      {order && (
        <View>
          <NftDetails
            nftContract={order.nftToken as ContractAddr}
            tokenId={order.nftTokenId}
            chain={chain}
            onSubmit={onSubmit}
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
