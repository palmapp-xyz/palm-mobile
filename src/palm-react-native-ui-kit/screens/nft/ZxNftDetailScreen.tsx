import { fetchUserProfileId } from 'palm-core/api/authChallenge'
import { COLOR, NETWORK } from 'palm-core/consts'
import { UTIL } from 'palm-core/libs'
import { getProfileDoc } from 'palm-core/libs/firebase'
import { Routes } from 'palm-core/libs/navigation'
import { nftUriFetcher } from 'palm-core/libs/nft'
import { stringifyMsgData } from 'palm-core/libs/sendbird'
import {
  ContractAddr,
  FbProfile,
  NftType,
  QueryKeyEnum,
  SbBuyNftDataType,
  SbUserMetadata,
  SupportedNetworkEnum,
  pToken,
} from 'palm-core/types'
import {
  Container,
  FormButton,
  FormImage,
  FormText,
  Header,
  Row,
} from 'palm-react-native-ui-kit/components'
import NativeTokenUSD from 'palm-react-native-ui-kit/components/molecules/NativeTokenUSD'
import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import useAuth from 'palm-react/hooks/auth/useAuth'
import useProfile from 'palm-react/hooks/auth/useProfile'
import useNativeToken from 'palm-react/hooks/independent/useNativeToken'
import useNftImage from 'palm-react/hooks/independent/useNftImage'
import useZxBuyNft from 'palm-react/hooks/zx/useZxBuyNft'
import useZxCancelNft from 'palm-react/hooks/zx/useZxCancelNft'
import useZxOrder from 'palm-react/hooks/zx/useZxOrder'
import appStore from 'palm-react/store/appStore'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { useQueryClient } from 'react-query'
import { useSetRecoilState } from 'recoil'

import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import { useSendbirdChat } from '@sendbird/uikit-react-native'
import { useAsyncEffect } from '@sendbird/uikit-utils'

import useToast from 'palm-react-native/app/useToast'
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
  const { profile } = useProfile({ profileId: user?.auth?.profileId! })
  const [listingOwner, setListingOwner] = useState<FbProfile>()
  const setLoading = useSetRecoilState(appStore.loading)

  const queryClient = useQueryClient()

  const isMine =
    order &&
    order.order.maker.toLocaleLowerCase() === user?.address.toLocaleLowerCase()

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, channelUrl)
  const { t } = useTranslation()
  const toast = useToast()

  const { onClickConfirm: onClickCancel } = useZxCancelNft(
    channelUrl,
    nonce,
    chain
  )
  const { onClickConfirm: onClickBuy } = useZxBuyNft(channelUrl, nonce, chain)

  const erc20TokenAmount = order?.erc20TokenAmount

  const { nativeToken } = useNativeToken({
    userAddress: user?.address,
    network: chain,
  })

  const myTargetBalance = (nativeToken?.balance || '0') as pToken

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
        toast.show(
          t('Nft.ZxNftDetailInsufficientBalanceToast', {
            balance: UTIL.formatAmountP(myTargetBalance),
            token: NETWORK.nativeToken[chain],
          }),
          { icon: 'info', color: 'red' }
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
      const _listingOwner = await getProfileDoc(userProfileId)
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
            <FormImage source={UTIL.getNetworkLogo(chain)} size={14} />
            <FormText font={'B'} size={18}>
              {UTIL.formatAmountP(erc20TokenAmount as pToken)}
            </FormText>
          </Row>
          <View>
            <NativeTokenUSD
              amount={erc20TokenAmount as pToken}
              network={chain}
            />
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
