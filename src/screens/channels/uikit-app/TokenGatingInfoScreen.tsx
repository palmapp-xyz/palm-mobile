import images from 'assets/images'
import { Container, FormImage, FormText, Header, Row } from 'components'
import NftRenderer, { NftRendererProp } from 'components/molecules/NftRenderer'
import { COLOR, NETWORK, UTIL } from 'consts'
import useAuth from 'hooks/auth/useAuth'
import useReactQuery from 'hooks/complex/useReactQuery'
import useNft from 'hooks/contract/useNft'
import useFsChannel from 'hooks/firestore/useFsChannel'
import useUserBalance from 'hooks/independent/useUserBalance'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import React, { ReactElement, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {
  FbChannelNativeGatingField,
  FbChannelNFTGatingField,
  NftType,
  QueryKeyEnum,
} from 'types'

import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import { useSendbirdChat } from '@sendbird/uikit-react-native'

const NativeGating = ({
  gating,
}: {
  gating: FbChannelNativeGatingField
}): ReactElement => {
  const { user } = useAuth()
  const { t } = useTranslation()

  const { balance } = useUserBalance({
    address: user?.address,
    chain: gating.chain,
  })

  const nativeToken = NETWORK.nativeToken[gating.chain]

  return (
    <View style={{ rowGap: 20 }}>
      <View style={{ rowGap: 4 }}>
        <FormText>{t('Channels.UiKitTokenGatingRequired')}</FormText>
        <FormText>{`${UTIL.setComma(gating.amount)} ${nativeToken}`}</FormText>
      </View>
      <View style={{ rowGap: 4 }}>
        <FormText>{t('Channels.UiKitTokenGatingMyBalance')}</FormText>
        <FormText>{`${UTIL.formatAmountP(balance)} ${nativeToken}`}</FormText>
      </View>
    </View>
  )
}

const NftGating = ({
  gating,
}: {
  gating: FbChannelNFTGatingField
}): ReactElement => {
  const nftContract = gating.tokenAddress
  const chain = gating.chain

  const { name } = useNft({ nftContract, chain })
  const { t } = useTranslation()

  const { data: tokenName = '' } = useReactQuery(
    [QueryKeyEnum.NFT_TOKEN_NAME, nftContract, chain],
    async () => name()
  )

  const nftRendererProps: NftRendererProp = {
    nftContract,
    tokenId: '1',
    type: NftType.ERC721,
    chain,
  }

  return (
    <View>
      <View
        style={{
          backgroundColor: COLOR.primary._100,
          height: 150,
          width: '100%',
        }}
      />
      <View
        style={{
          marginTop: -50,
          backgroundColor: 'white',
          borderWidth: 2,
          width: 120,
          borderRadius: 999,
          borderColor: COLOR.primary._50,
        }}
      >
        <NftRenderer {...nftRendererProps} width={120} height={120} />
      </View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
        }}
      >{`${tokenName} holders`}</Text>

      <Text style={{ fontSize: 16 }}>
        {t('Channels.UiKitTokenGatingInfoEntryRequirement')}
      </Text>
      <Row style={{ alignItems: 'center', columnGap: 10 }}>
        <Text>{nftContract}</Text>
      </Row>
      <View style={{ backgroundColor: COLOR.black._300, padding: 10 }}>
        <Text>{t('Channels.UiKitTokenGatingInfoEntryRequirementHint')}</Text>
      </View>
    </View>
  )
}

const TokenGatingInfoScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.TokenGatingInfo>()
  const { sdk } = useSendbirdChat()
  const { channelUrl } = params
  const { channel } = useGroupChannel(sdk, channelUrl)
  const { t } = useTranslation()

  const { fsChannelField } = useFsChannel({
    channelUrl: params.channelUrl,
  })
  const gating = useMemo(() => fsChannelField?.gating, [fsChannelField])

  const { user } = useAuth()
  const membersWithoutMe = useMemo(
    () =>
      channel?.members.filter(x => x.userId !== user?.auth?.profileId) || [],
    [channel?.members]
  )

  if (!channel) {
    return <></>
  }

  return (
    <Container style={styles.container}>
      <Header
        title={t('Channels.UiKitPrivateChannelHeaderTitle')}
        left="back"
        onPressLeft={navigation.goBack}
      />
      <View style={styles.body}>
        {gating?.gatingType === 'NFT' && <NftGating gating={gating} />}
        {gating?.gatingType === 'Native' && <NativeGating gating={gating} />}
        <FlatList
          data={membersWithoutMe}
          keyExtractor={(_, index): string => `members-${index}`}
          numColumns={3}
          columnWrapperStyle={{ gap: 10 }}
          renderItem={({ item }): ReactElement => {
            const source = item.profileUrl
              ? { uri: item.profileUrl }
              : images.blank_profile
            return (
              <View style={{ alignItems: 'center' }}>
                <FormImage
                  source={source}
                  size={80}
                  style={{ borderRadius: 999 }}
                />
                <Text>{item.nickname}</Text>
              </View>
            )
          }}
        />
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={(): void => {
            channel.leave(channel.myRole === 'operator').then(() => {
              navigation.navigate(Routes.GroupChannelList)
              sdk.clearCachedMessages([channel.url]).catch()
            })
          }}
        >
          <Ionicons name="exit-outline" size={24} color={COLOR.error} />
        </TouchableOpacity>
      </View>
    </Container>
  )
}

export default TokenGatingInfoScreen

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { flex: 1, padding: 10, gap: 10 },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLOR.black._90010,
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
})
