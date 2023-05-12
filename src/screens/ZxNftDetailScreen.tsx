import {
  Container,
  FormButton,
  FormImage,
  FormText,
  Header,
  Row,
} from 'components'
import useAuth from 'hooks/auth/useAuth'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useZxBuyNft from 'hooks/zx/useZxBuyNft'
import useZxCancelNft from 'hooks/zx/useZxCancelNft'
import useZxOrder from 'hooks/zx/useZxOrder'
import { Routes } from 'libs/navigation'
import { nftUriFetcher } from 'libs/nft'
import { stringifySendFileData } from 'libs/sendbird'
import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useQueryClient } from 'react-query'
import {
  ContractAddr,
  NftType,
  pToken,
  QueryKeyEnum,
  SupportedNetworkEnum,
} from 'types'

import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import { useSendbirdChat } from '@sendbird/uikit-react-native'

import { COLOR, NETWORK, UTIL } from 'consts'
import useEthPrice from 'hooks/independent/useEthPrice'
import useKlayPrice from 'hooks/independent/useKlayPrice'
import useNftImage from 'hooks/independent/useNftImage'
import NftDetails from '../components/NftDetails'

const InitNftUri = ({
  nftContract,
  tokenId,
  type,
  chain,
  setNftUri,
}: {
  nftContract: ContractAddr
  tokenId: string
  type: NftType
  chain: SupportedNetworkEnum
  setNftUri: (value: string) => void
}): ReactElement => {
  const { uri } = useNftImage({
    nftContract,
    tokenId,
    type,
    chain,
  })

  useEffect(() => {
    if (uri) {
      setNftUri(uri)
    }
  }, [uri])

  return <View />
}

const ZxNftDetailScreen = (): ReactElement => {
  const [nftUri, setNftUri] = useState('')
  const {
    navigation,
    params: { nonce, channelUrl, chain, item },
  } = useAppNavigation<Routes.ZxNftDetail>()
  const { order } = useZxOrder({ nonce, chain })
  const { getEthPrice } = useEthPrice()
  const { getKlayPrice } = useKlayPrice()

  const queryClient = useQueryClient()

  const { user } = useAuth()

  const isMine =
    order &&
    order.order.maker.toLocaleLowerCase() === user?.address.toLocaleLowerCase()

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, channelUrl)

  const { onClickConfirm: onClickCancel } = useZxCancelNft(
    channelUrl,
    nonce,
    chain
  )
  const { onClickConfirm: onClickBuy } = useZxBuyNft(channelUrl, nonce, chain)

  const erc20TokenAmount = order?.erc20TokenAmount

  const usdPrice = useMemo(
    () =>
      chain === SupportedNetworkEnum.ETHEREUM
        ? getEthPrice(erc20TokenAmount as pToken)
        : chain === SupportedNetworkEnum.KLAYTN
        ? getKlayPrice(erc20TokenAmount as pToken)
        : ('0' as pToken),
    [erc20TokenAmount]
  )

  const onSubmit = async (): Promise<void> => {
    if (!order) {
      return
    }

    if (isMine) {
      await onClickCancel({ order: order.order })
    } else {
      const buyRes = await onClickBuy({ order: order.order })
      if (channel && user && buyRes.success) {
        const imgInfo = await nftUriFetcher(nftUri)
        imgInfo.data = stringifySendFileData({
          type: 'buy',
          selectedNft: order,
          buyer: user.auth!.profileId,
        })
        channel.sendFileMessage(imgInfo)
      }
    }
    queryClient.removeQueries([QueryKeyEnum.ZX_ORDERS, chain])

    navigation.navigate(Routes.GroupChannel, { channelUrl })
  }

  return (
    <Container style={styles.container}>
      <Header title="Buy NFT" left="back" onPressLeft={navigation.goBack} />
      {order && (
        <>
          <InitNftUri
            setNftUri={setNftUri}
            nftContract={order.nftToken as ContractAddr}
            tokenId={order.nftTokenId}
            type={order.nftType as NftType}
            chain={chain}
          />
          <NftDetails
            nftContract={order.nftToken as ContractAddr}
            tokenId={order.nftTokenId}
            type={order.nftType as NftType}
            chain={chain}
            item={item}
          />
        </>
      )}
      <Row style={styles.footer}>
        <View style={{ flex: 1 }}>
          <Row style={{ alignItems: 'center', columnGap: 4 }}>
            <FormImage source={NETWORK.getNetworkLogo(chain)} size={14} />
            <FormText fontType="B.18">
              {UTIL.formatAmountP(erc20TokenAmount as pToken)}
            </FormText>
          </Row>
          <View>
            <FormText fontType="R.10" color={COLOR.black._400}>
              {`(≈$${UTIL.formatAmountP(usdPrice, { toFix: 0 })})`}
            </FormText>
          </View>
        </View>
        <FormButton onPress={onSubmit}>{isMine ? 'Cancel' : 'Buy'}</FormButton>
      </Row>
    </Container>
  )
}

export default ZxNftDetailScreen

const styles = StyleSheet.create({
  container: { flex: 1 },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLOR.black._90010,
    paddingVertical: 12,
    paddingHorizontal: 20,
    columnGap: 8,
  },
})
