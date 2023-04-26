import React, { ReactElement, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useRecoilValue } from 'recoil'
import { Icon } from '@sendbird/uikit-react-native-foundation'
import { useSendbirdChat } from '@sendbird/uikit-react-native'
import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import { useAsyncEffect } from '@sendbird/uikit-utils'

import { UTIL } from 'consts'
import { Moralis, SupportedNetworkEnum, User } from 'types'
import selectNftStore from 'store/selectNftStore'
import {
  Header,
  SubmitButton,
  Container,
  Row,
  MoralisNftRenderer,
} from 'components'
import useSendNft from 'hooks/page/groupChannel/useSendNft'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import { nftUriFetcher } from 'libs/nft'
import { stringifySendFileData } from 'libs/sendbird'
import useAuth from 'hooks/auth/useAuth'
import { chainIdToSupportedNetworkEnum } from 'libs/utils'
import useFsProfile from 'hooks/firestore/useFsProfile'

const Contents = ({
  selectedNft,
  receiverId,
  channelUrl,
  chain,
}: {
  selectedNft: Moralis.NftItem
  receiverId: string
  channelUrl?: string
  chain: SupportedNetworkEnum
}): ReactElement => {
  const { user } = useAuth()
  const [receiver, setReceiver] = useState<User>()
  const { isPosting, isValidForm, onClickConfirm } = useSendNft({
    selectedNft,
    receiver: receiver?.address,
  })

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, channelUrl ?? receiverId)

  const onSubmit = async (token_uri: string): Promise<void> => {
    if (!channel || !user) {
      return
    }

    const imgInfo = await nftUriFetcher(token_uri)
    imgInfo.data = stringifySendFileData({
      type: 'send',
      selectedNft,
      from: user.profileId,
      to: receiverId,
    })
    channel.sendFileMessage(imgInfo)
  }

  const { fetchProfile } = useFsProfile({})
  useAsyncEffect(async () => {
    const _receiver = await fetchProfile(receiverId)
    setReceiver(_receiver)
  }, [receiverId])

  return (
    <View style={styles.body}>
      <View>
        <Row style={{ paddingBottom: 10 }}>
          <View style={{ width: 100, height: 100, marginEnd: 10 }}>
            <MoralisNftRenderer item={selectedNft} />
          </View>
          <View style={{ rowGap: 10 }}>
            <Text>Address : {UTIL.truncate(selectedNft.token_address)}</Text>
            <Text>ID : {selectedNft.token_id}</Text>
          </View>
        </Row>
        <View>
          <Text style={{ fontSize: 20 }}>Receiver</Text>
          <Text>{receiver?.address || 'Loading...'}</Text>
        </View>
      </View>
      <SubmitButton
        network={chain}
        disabled={isPosting || !isValidForm}
        onPress={async (): Promise<void> => {
          const res = await onClickConfirm()
          if (res?.success) {
            onSubmit(selectedNft.token_uri)
          }
        }}>
        Send
      </SubmitButton>
    </View>
  )
}

const SendNftScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.SendNft>()

  const selectedNftList = useRecoilValue(selectNftStore.selectedNftList)
  const selectedNft = selectedNftList[0]!
  const chain: SupportedNetworkEnum =
    chainIdToSupportedNetworkEnum(selectedNft.chainId || '0x1') ||
    SupportedNetworkEnum.ETHEREUM

  return (
    <Container style={styles.container}>
      <Header
        title="Send NFT"
        left={<Icon icon={'close'} />}
        onPressLeft={navigation.goBack}
      />
      {selectedNftList.length > 0 && (
        <Contents
          selectedNft={selectedNftList[0]}
          receiverId={params.receiverId}
          channelUrl={params.channelUrl}
          chain={chain}
        />
      )}
    </Container>
  )
}

export default SendNftScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    padding: 20,
    flex: 1,
    justifyContent: 'space-between',
  },
})
