import React, { ReactElement, useMemo } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { useSendbirdChat } from '@sendbird/uikit-react-native'
import { useGroupChannel } from '@sendbird/uikit-chat-hooks'

import { COLOR, NETWORK, UTIL } from 'consts'

import {
  FbChannelNativeGatingField,
  FbChannelNFTGatingField,
  NftType,
  QueryKeyEnum,
} from 'types'
import images from 'assets/images'
import { Container, FormImage, FormText, Header, Row } from 'components'
import { Routes } from 'libs/navigation'
import useNft from 'hooks/contract/useNft'
import useReactQuery from 'hooks/complex/useReactQuery'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useAuth from 'hooks/independent/useAuth'
import useFsChannel from 'hooks/firestore/useFsChannel'
import NftRenderer, { NftRendererProp } from 'components/molecules/NftRenderer'
import useUserBalance from 'hooks/independent/useUserBalance'

const NativeGating = ({
  gating,
}: {
  gating: FbChannelNativeGatingField
}): ReactElement => {
  const { user } = useAuth(gating.chain)

  const { balance } = useUserBalance({
    address: user?.address,
    chain: gating.chain,
  })

  const nativeToken = NETWORK.nativeToken[gating.chain]

  return (
    <View style={{ rowGap: 20 }}>
      <View style={{ rowGap: 4 }}>
        <FormText fontType="R.14">Required</FormText>
        <FormText>{`${UTIL.setComma(gating.amount)} ${nativeToken}`}</FormText>
      </View>
      <View style={{ rowGap: 4 }}>
        <FormText fontType="R.14">My balance</FormText>
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
        }}>
        <NftRenderer {...nftRendererProps} width={120} height={120} />
      </View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
        }}>{`${tokenName} holders`}</Text>

      <Text style={{ fontSize: 16 }}>Entry requirement</Text>
      <Row style={{ alignItems: 'center', columnGap: 10 }}>
        <Text>{nftContract}</Text>
      </Row>
      <View style={{ backgroundColor: COLOR.black._300, padding: 10 }}>
        <Text>
          You need to meet the above requirement to have access to the space.
        </Text>
      </View>
    </View>
  )
}

const TokenGatingInfoScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.TokenGatingInfo>()
  const { sdk } = useSendbirdChat()
  const { channelUrl } = params
  const { channel } = useGroupChannel(sdk, channelUrl)

  const { fsChannelField } = useFsChannel({
    channelUrl: params.channelUrl,
  })
  const gating = useMemo(() => fsChannelField?.gating, [fsChannelField])

  const { user } = useAuth(gating?.chain)
  const membersWithoutMe = useMemo(
    () => channel?.members.filter(x => x.userId !== user?.profileId) || [],
    [channel?.members]
  )

  if (!channel) {
    return <></>
  }

  return (
    <Container style={styles.container}>
      <Header
        title={'Private channel'}
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
    </Container>
  )
}

export default TokenGatingInfoScreen

const styles = StyleSheet.create({
  container: {},
  body: { padding: 10, gap: 10 },
})
