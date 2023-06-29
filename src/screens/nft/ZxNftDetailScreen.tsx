import {
  Container,
  FormButton,
  FormImage,
  FormText,
  Header,
  Row,
} from 'components'
import { COLOR, NETWORK, UTIL } from 'consts'
import useAuthChallenge from 'hooks/api/useAuthChallenge'
import useAuth from 'hooks/auth/useAuth'
import useProfile from 'hooks/auth/useProfile'
import useEthPrice from 'hooks/independent/useEthPrice'
import useKlayPrice from 'hooks/independent/useKlayPrice'
import useMaticPrice from 'hooks/independent/useMaticPrice'
import useNftImage from 'hooks/independent/useNftImage'
import useUserBalance from 'hooks/independent/useUserBalance'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useZxBuyNft from 'hooks/zx/useZxBuyNft'
import useZxCancelNft from 'hooks/zx/useZxCancelNft'
import useZxOrder from 'hooks/zx/useZxOrder'
import { getFsProfile } from 'libs/firebase'
import { Routes } from 'libs/navigation'
import { nftUriFetcher } from 'libs/nft'
import { stringifyMsgData } from 'libs/sendbird'
import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, StyleSheet, View } from 'react-native'
import { useQueryClient } from 'react-query'
import { useSetRecoilState } from 'recoil'
import appStore from 'store/appStore'
import {
  ContractAddr,
  FbProfile,
  NftType,
  QueryKeyEnum,
  SbBuyNftDataType,
  SbUserMetadata,
  SupportedNetworkEnum,
  pToken,
} from 'types'

import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import { useSendbirdChat } from '@sendbird/uikit-react-native'
import { useAsyncEffect } from '@sendbird/uikit-utils'

import NftDetails from '../../components/NftDetails'

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
  const { user } = useAuth()
  const { profile } = useProfile({ profileId: user?.auth?.profileId })
  const [listingOwner, setListingOwner] = useState<FbProfile>()
  const { fetchUserProfileId } = useAuthChallenge()
  const setLoading = useSetRecoilState(appStore.loading)

  const { getEthPrice } = useEthPrice()
  const { getKlayPrice } = useKlayPrice()
  const { getMaticPrice } = useMaticPrice()

  const userAddress = user?.address
  const { balance: ethBalance } = useUserBalance({
    address: userAddress,
    chain: SupportedNetworkEnum.ETHEREUM,
  })
  const { balance: klayBalance } = useUserBalance({
    address: userAddress,
    chain: SupportedNetworkEnum.KLAYTN,
  })
  const { balance: maticBalance } = useUserBalance({
    address: userAddress,
    chain: SupportedNetworkEnum.POLYGON,
  })

  const queryClient = useQueryClient()

  const isMine =
    order &&
    order.order.maker.toLocaleLowerCase() === user?.address.toLocaleLowerCase()

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, channelUrl)
  const { t } = useTranslation()

  const { onClickConfirm: onClickCancel } = useZxCancelNft(
    channelUrl,
    nonce,
    chain
  )
  const { onClickConfirm: onClickBuy } = useZxBuyNft(channelUrl, nonce, chain)

  const erc20TokenAmount = order?.erc20TokenAmount

  const myTargetBalance =
    chain === SupportedNetworkEnum.ETHEREUM
      ? ethBalance
      : chain === SupportedNetworkEnum.KLAYTN
      ? klayBalance
      : maticBalance

  const usdPrice = useMemo(
    () =>
      chain === SupportedNetworkEnum.ETHEREUM
        ? getEthPrice(erc20TokenAmount as pToken)
        : chain === SupportedNetworkEnum.KLAYTN
        ? getKlayPrice(erc20TokenAmount as pToken)
        : getMaticPrice(erc20TokenAmount as pToken),
    [erc20TokenAmount]
  )

  const onSubmit = async (): Promise<void> => {
    if (!order || !profile || !listingOwner) {
      return
    }

    if (isMine) {
      await onClickCancel({ order: order.order })
    } else {
      const hasEnoughBalance = UTIL.toBn(erc20TokenAmount || 0).lte(
        myTargetBalance
      )
      if (hasEnoughBalance === false) {
        Alert.alert(
          t('Nft.ZxNftDetailInsufficientBalanceAlertTitle'),
          t('Nft.ZxNftDetailInsufficientBalanceAlertMessage', {
            balance: UTIL.formatAmountP(myTargetBalance),
            token: NETWORK.nativeToken[chain],
          })
        )
        return
      }
      const buyRes = await onClickBuy({ order: order.order })
      if (channel && user && buyRes.success) {
        const imgInfo = await nftUriFetcher(nftUri)
        imgInfo.data = stringifyMsgData({
          type: 'buy',
          selectedNft: order,
          buyer: {
            profileId: profile.profileId,
            handle: profile.handle,
            address: profile.address,
          } as SbUserMetadata,
          from: {
            profileId: listingOwner.profileId,
            handle: listingOwner.handle,
            address: listingOwner.address,
          } as SbUserMetadata,
          price: {
            tokenName: NETWORK.nativeToken[chain],
            amount: UTIL.formatAmountP(erc20TokenAmount as pToken, {
              toFix: 2,
            }),
          },
        } as SbBuyNftDataType)
        channel.sendFileMessage(imgInfo)
      }
    }
    queryClient.removeQueries([QueryKeyEnum.ZX_ORDERS, chain])

    navigation.navigate(Routes.GroupChannel, { channelUrl })
  }

  useAsyncEffect(async () => {
    if (!order) {
      return
    }

    setLoading(true)
    const userProfileId = await fetchUserProfileId(
      order.order.maker as ContractAddr
    )
    if (userProfileId) {
      const _listingOwner = await getFsProfile(userProfileId)
      setLoading(false)
      setTimeout(() => {
        setListingOwner(_listingOwner)
      }, 200)
    }
  }, [order])

  return (
    <Container style={styles.container}>
      <Header
        title={t('Nft.ZxNftDetailHeaderTitle')}
        left="back"
        onPressLeft={navigation.goBack}
      />
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
            <FormText font={'B'} size={18}>
              {UTIL.formatAmountP(erc20TokenAmount as pToken)}
            </FormText>
          </Row>
          <View>
            <FormText color={COLOR.black._400}>
              {t('Common.UsdPrice', {
                price: UTIL.formatAmountP(usdPrice, { toFix: 2 }),
              })}
            </FormText>
          </View>
        </View>
        <FormButton
          disabled={!order || !listingOwner || !profile}
          onPress={onSubmit}
        >
          {isMine ? t('Common.Cancel') : t('Common.Buy')}
        </FormButton>
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
