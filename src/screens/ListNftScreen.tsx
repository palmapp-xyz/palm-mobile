import {
  ChainLogoWrapper,
  Container,
  FormInput,
  FormText,
  Header,
  KeyboardAvoidingView,
  MoralisNftRenderer,
  Row,
  SubmitButton,
} from 'components'
import { COLOR, NETWORK, UTIL } from 'consts'
import { SignedNftOrderV4Serialized } from 'evm-nft-swap'
import useReactQuery from 'hooks/complex/useReactQuery'
import useNft from 'hooks/contract/useNft'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useZxListNft from 'hooks/zx/useZxListNft'
import { Routes } from 'libs/navigation'
import { nftUriFetcher } from 'libs/nft'
import { stringifySendFileData } from 'libs/sendbird'
import { chainIdToSupportedNetworkEnum } from 'libs/utils'
import React, { ReactElement, useEffect, useState } from 'react'
import { FlatList, Keyboard, StyleSheet, View } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import { useRecoilValue } from 'recoil'
import selectNftStore from 'store/selectNftStore'
import { Moralis, QueryKeyEnum, SupportedNetworkEnum, Token } from 'types'

import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import { useSendbirdChat } from '@sendbird/uikit-react-native'

const Contents = ({
  channelUrl,
  selectedNft,
  chain,
}: {
  channelUrl: string
  selectedNft: Moralis.NftItem
  chain: SupportedNetworkEnum
}): ReactElement => {
  const nftContract = selectedNft.token_address

  const [attributes, setAttributes] = useState<
    { trait_type: string; value: string }[]
  >([])
  const { price, setPrice, isApproved, onClickApprove, onClickConfirm } =
    useZxListNft({
      nftContract,
      tokenId: selectedNft.token_id,
      chain,
      channelUrl,
    })
  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, channelUrl)

  const { name } = useNft({ nftContract, chain })

  const { data: tokenName = '' } = useReactQuery(
    [QueryKeyEnum.NFT_TOKEN_NAME, nftContract, chain],
    name
  )

  const onSubmit = async (
    token_uri: string,
    order: SignedNftOrderV4Serialized | undefined
  ): Promise<void> => {
    if (!channel || !order) {
      return
    }
    const imgInfo = await nftUriFetcher(token_uri)
    imgInfo.data = stringifySendFileData({
      type: 'list',
      selectedNft,
      nonce: order.nonce,
      ethAmount: UTIL.microfyP(price),
    })
    channel.sendFileMessage(imgInfo)
  }

  useEffect(() => {
    try {
      setAttributes(JSON.parse(selectedNft.metadata || '')?.attributes)
    } catch {}
  }, [])

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <View style={styles.body}>
        <View style={{ paddingHorizontal: 20 }}>
          <FormText fontType="B.14">I want to sell this NFT for</FormText>
          <Row style={{ paddingBottom: 10 }}>
            <View style={{ width: 100, height: 100, marginEnd: 10 }}>
              <ChainLogoWrapper chain={chain}>
                <MoralisNftRenderer item={selectedNft} />
              </ChainLogoWrapper>
            </View>
            <View style={{ rowGap: 10 }}>
              <FormText style={{ fontWeight: 'bold' }}>{tokenName}</FormText>
              <FormText>#{selectedNft.token_id}</FormText>
            </View>
          </Row>
          <Row style={styles.traitsBox}>
            <FlatList
              data={attributes}
              keyExtractor={(item, index): string => `attributes-${index}`}
              horizontal
              contentContainerStyle={{ gap: 10 }}
              renderItem={({ item }): ReactElement => {
                return (
                  <View style={styles.traits}>
                    <FormText>{item.trait_type}</FormText>
                    <FormText style={{ color: COLOR.primary._400 }}>
                      {item.value}
                    </FormText>
                  </View>
                )
              }}
            />
          </Row>
        </View>
        <View>
          {isApproved ? (
            <View>
              <View style={styles.priceBox}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <FormText style={{ color: 'white' }}>
                    Current Floor Price
                  </FormText>
                  <FormText style={{ color: 'white', fontWeight: 'bold' }}>
                    2.5 ETH
                  </FormText>
                </Row>
                <Row style={{ justifyContent: 'space-between' }}>
                  <FormText style={{ color: 'white' }}>Gas Fee</FormText>
                  <FormText style={{ color: 'white', fontWeight: 'bold' }}>
                    0.01 ETH
                  </FormText>
                </Row>
                <View style={{ position: 'relative' }}>
                  <FormInput
                    placeholder="Price"
                    maxLength={10}
                    value={price}
                    onChangeText={(value): void => {
                      setPrice(value as Token)
                    }}
                  />
                  <FormText
                    style={{
                      position: 'absolute',
                      right: 20,
                      top: 15,
                    }}
                  >
                    {NETWORK.nativeToken[chain]}
                  </FormText>
                </View>
              </View>
              <View
                style={{ paddingHorizontal: 25, gap: 5, paddingVertical: 10 }}
              >
                <Row style={{ alignItems: 'flex-start' }}>
                  <Ionicon name="checkmark-circle-outline" size={14} />
                  <FormText style={{ paddingRight: 15 }}>
                    The sale will be accepted and concluded unless you cancel
                    it.
                  </FormText>
                </Row>
                <Row style={{ alignItems: 'flex-start' }}>
                  <Ionicon name="checkmark-circle-outline" size={14} />
                  <FormText style={{}}>
                    The sale listing is valid for 24 hours.
                  </FormText>
                </Row>
              </View>
              <SubmitButton
                network={SupportedNetworkEnum.ETHEREUM}
                disabled={!price}
                onPress={async (): Promise<void> => {
                  Keyboard.dismiss()
                  const order = await onClickConfirm()
                  onSubmit(selectedNft.token_uri, order)
                }}
              >
                List up to sell
              </SubmitButton>
            </View>
          ) : (
            <View>
              <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                <FormText style={{ fontWeight: 'bold' }}>
                  Approve to list your NFT
                </FormText>
              </View>
              <View style={styles.footer}>
                <SubmitButton
                  network={SupportedNetworkEnum.ETHEREUM}
                  onPress={(): void => {
                    Keyboard.dismiss()
                    onClickApprove()
                  }}
                >
                  Approve
                </SubmitButton>
              </View>
            </View>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const ListNftScreen = (): ReactElement => {
  const { params, navigation } = useAppNavigation<Routes.ListNft>()

  const selectedNftList = useRecoilValue(selectNftStore.selectedNftList)
  const selectedNft = selectedNftList[0]!
  const chain: SupportedNetworkEnum =
    chainIdToSupportedNetworkEnum(selectedNft.chainId || '0x1') ||
    SupportedNetworkEnum.ETHEREUM

  return (
    <Container style={{ flex: 1 }}>
      <Header right="close" onPressRight={navigation.goBack} />
      {selectedNftList.length > 0 && (
        <Contents
          channelUrl={params.channelUrl}
          selectedNft={selectedNft}
          chain={chain}
        />
      )}
    </Container>
  )
}

export default ListNftScreen

const styles = StyleSheet.create({
  body: {
    paddingTop: 20,
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  priceBox: {
    backgroundColor: COLOR.primary._400,
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    rowGap: 10,
    marginHorizontal: 20,
  },
  traitsBox: {
    columnGap: 10,
  },
  traits: {
    rowGap: 5,
    alignItems: 'center',
    backgroundColor: COLOR.primary._100,
    borderRadius: 15,
    padding: 20,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLOR.black._90010,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
})
