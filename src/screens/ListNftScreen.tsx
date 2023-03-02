import React, { ReactElement } from 'react'
import { Keyboard, StyleSheet, Text, View } from 'react-native'
import { Icon } from '@sendbird/uikit-react-native-foundation'
import { useRecoilValue } from 'recoil'
import { SignedNftOrderV4Serialized } from '@traderxyz/nft-swap-sdk'
import firestore from '@react-native-firebase/firestore'
import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import { useSendbirdChat } from '@sendbird/uikit-react-native'

import { COLOR, UTIL } from 'consts'
import { Moralis, Token } from 'types'
import {
  Header,
  SubmitButton,
  FormInput,
  Container,
  Row,
  NftRenderer,
} from 'components'
import useZxListNft from 'hooks/zx/useZxListNft'
import { Routes } from 'libs/navigation'
import { useAppNavigation } from 'hooks/useAppNavigation'
import selectNftStore from 'store/selectNftStore'
import { nftUriFetcher } from 'libs/nft'
import { stringifySendFileData } from 'libs/sendbird'

const Contents = ({
  channelUrl,
  selectedNft,
}: {
  channelUrl: string
  selectedNft: Moralis.NftItem
}): ReactElement => {
  const { price, setPrice, isApproved, onClickApprove, onClickConfirm } =
    useZxListNft({
      nftContract: selectedNft.token_address,
      tokenId: selectedNft.token_id,
    })
  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, channelUrl)

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

    try {
      const channelDoc = await firestore()
        .collection('channels')
        .doc(channel.url)
        .get()
      // legacy: add the non-existing (if not exists) channel to firestore
      if (!channelDoc.exists) {
        await firestore()
          .collection('channels')
          .doc(channel.url)
          .set({ url: channel.url, channelType: channel.channelType })
      }
      // add the new listing item to the corresponding channel doc firestore
      await firestore()
        .collection('channels')
        .doc(channel.url)
        .collection('listings')
        .doc(order.nonce)
        .set(order)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <View style={styles.body}>
      <View>
        <Row style={{ paddingBottom: 10 }}>
          <View style={{ width: 100, height: 100, marginEnd: 10 }}>
            <NftRenderer
              nftContract={selectedNft.token_address}
              tokenId={selectedNft.token_id}
            />
          </View>
          <View style={{ rowGap: 10 }}>
            <Text>Address : {UTIL.truncate(selectedNft.token_address)}</Text>
            <Text>ID : {selectedNft.token_id}</Text>
          </View>
        </Row>
        <Text style={{ fontSize: 20 }}>Price</Text>
        <FormInput
          maxLength={10}
          value={price}
          onChangeText={(value): void => {
            setPrice(value as Token)
          }}
        />
      </View>
      <View>
        <Row style={{ paddingBottom: 10 }}>
          <Text
            style={{
              fontWeight: 'bold',
              color: isApproved ? COLOR.gray._700 : COLOR.primary._400,
            }}>
            1. Approve
          </Text>
          <Text>{' -> '}</Text>
          <Text
            style={{
              fontWeight: 'bold',
              color: isApproved ? COLOR.primary._400 : COLOR.gray._700,
            }}>
            2. Listing
          </Text>
        </Row>
        {isApproved ? (
          <SubmitButton
            disabled={!price}
            onPress={async (): Promise<void> => {
              Keyboard.dismiss()
              const order = await onClickConfirm()
              onSubmit(selectedNft.token_uri, order)
            }}>
            List up to sell
          </SubmitButton>
        ) : (
          <View>
            <SubmitButton
              onPress={(): void => {
                Keyboard.dismiss()
                onClickApprove()
              }}>
              Approve
            </SubmitButton>
            <Text>Approve to sell item</Text>
          </View>
        )}
      </View>
    </View>
  )
}

const ListNftScreen = (): ReactElement => {
  const { params, navigation } = useAppNavigation<Routes.ListNft>()

  const selectedNftList = useRecoilValue(selectNftStore.selectedNftList)

  return (
    <Container style={{ flex: 1 }}>
      <Header
        title="List NFT"
        left={<Icon icon={'close'} />}
        onPressLeft={navigation.goBack}
      />
      {selectedNftList.length > 0 && (
        <Contents
          channelUrl={params.channelUrl}
          selectedNft={selectedNftList[0]}
        />
      )}
    </Container>
  )
}

export default ListNftScreen

const styles = StyleSheet.create({
  body: {
    padding: 20,
    flex: 1,
    justifyContent: 'space-between',
  },
})
