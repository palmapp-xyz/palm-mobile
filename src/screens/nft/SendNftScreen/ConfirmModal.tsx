import images from 'assets/images'
import {
  FormBottomSheet,
  FormButton,
  FormImage,
  FormText,
  MediaRenderer,
  MoralisNftRenderer,
  Row,
} from 'components'
import { COLOR, NETWORK, UTIL } from 'consts'
import useAuth from 'hooks/auth/useAuth'
import useSendNft from 'hooks/page/groupChannel/useSendNft'
import { getFsProfile } from 'libs/firebase'
import { getProfileMediaImg } from 'libs/lens'
import { nftUriFetcher } from 'libs/nft'
import { stringifySendFileData } from 'libs/sendbird'
import { chainIdToSupportedNetworkEnum } from 'libs/utils'
import _ from 'lodash'
import React, { ReactElement, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { FbProfile, Moralis, SupportedNetworkEnum } from 'types'

import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import { useSendbirdChat } from '@sendbird/uikit-react-native'
import { useAsyncEffect } from '@sendbird/uikit-utils'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useToast from 'hooks/useToast'
import { Routes } from 'libs/navigation'

const ConfirmModal = ({
  selectedNft,
  receiverId,
  channelUrl,
  showBottomSheet,
  setShowBottomSheet,
}: {
  selectedNft: Moralis.NftItem
  receiverId: string
  channelUrl?: string
  showBottomSheet: boolean
  setShowBottomSheet: React.Dispatch<React.SetStateAction<boolean>>
}): ReactElement => {
  const { user } = useAuth()
  const [receiver, setReceiver] = useState<FbProfile>()
  const chain: SupportedNetworkEnum =
    chainIdToSupportedNetworkEnum(selectedNft.chainId || '0x1') ||
    SupportedNetworkEnum.ETHEREUM

  const { navigation } = useAppNavigation<Routes.SendNft>()
  const toast = useToast()

  const receiverProfileImg = getProfileMediaImg(receiver?.picture)
  const { isPosting, isValidForm, onClickConfirm, estimatedTxFee } = useSendNft(
    {
      selectedNft,
      receiver: receiver?.address,
    }
  )

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
      from: user!.auth!.profileId,
      to: receiverId,
    })
    channel.sendFileMessage(imgInfo)
  }

  useAsyncEffect(async () => {
    const _receiver = await getFsProfile(receiverId)
    setReceiver(_receiver)
  }, [receiverId])

  return (
    <FormBottomSheet
      showBottomSheet={showBottomSheet}
      snapPoints={['70%']}
      onClose={(): void => {
        setShowBottomSheet(false)
      }}
    >
      <View style={styles.body}>
        <View style={{ padding: 20 }}>
          <View
            style={{
              paddingVertical: 12,
              paddingHorizontal: 16,
              backgroundColor: '#FF002E0d',
              borderRadius: 14,
            }}
          >
            <FormText fontType="R.12" color={COLOR.error}>
              This action is irreversible. Again, make sure the transaction
              detail is correct and reliable.
            </FormText>
          </View>
        </View>
        <View style={styles.itemInfo}>
          <Row style={{ columnGap: 12, marginBottom: 24 }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                overflow: 'hidden',
              }}
            >
              <MoralisNftRenderer item={selectedNft} hideChain />
            </View>
            <View style={{ rowGap: 4, flex: 1 }}>
              <FormText fontType="R.14">{selectedNft.name}</FormText>
              <FormText fontType="B.18">
                {selectedNft.name}#{selectedNft.token_id}
              </FormText>
            </View>
          </Row>
          <Row
            style={{
              position: 'relative',
              justifyContent: 'center',
              marginBottom: 12,
            }}
          >
            <View
              style={{
                position: 'absolute',
                borderWidth: 0.5,
                borderColor: COLOR.black._200,
                width: '100%',
                top: 12,
              }}
            />
            <Row
              style={{
                alignItems: 'center',
                columnGap: 4,
                marginBottom: 12,
                backgroundColor: COLOR.black._10,
                paddingHorizontal: 20,
              }}
            >
              <FormText>on</FormText>
              <FormImage source={NETWORK.getNetworkLogo(chain)} />
              <FormText>{_.capitalize(chain)}</FormText>
            </Row>
          </Row>
          <Row
            style={{ justifyContent: 'space-between', alignItems: 'center' }}
          >
            <View>
              <View style={styles.fromTo}>
                <FormText fontType="SB.12">From</FormText>
              </View>
              <FormText fontType="B.16">Me</FormText>
              <FormText fontType="R.12">
                {`(${UTIL.truncate(user?.address || '')})`}
              </FormText>
            </View>
            <View>
              <Ionicons
                name="arrow-forward"
                size={28}
                color={COLOR.black._200}
              />
            </View>
            <View>
              <View style={styles.fromTo}>
                <FormText fontType="SB.12">To</FormText>
              </View>
              <Row>
                {receiverProfileImg ? (
                  <MediaRenderer
                    src={receiverProfileImg}
                    width={20}
                    height={20}
                    style={{ borderRadius: 50 }}
                  />
                ) : (
                  <FormImage
                    source={images.profile_temp}
                    size={20}
                    style={{ borderRadius: 50 }}
                  />
                )}

                <FormText fontType="B.16">{receiver?.handle}</FormText>
              </Row>
              <FormText fontType="R.12">
                {`(${UTIL.truncate(receiver?.address || '')})`}
              </FormText>
            </View>
          </Row>
        </View>
        <View style={styles.txInfo}>
          <Row style={{ justifyContent: 'space-between' }}>
            <FormText fontType="B.14">Est. Gas Fee</FormText>
            <FormText fontType="R.14">{`${UTIL.demicrofyP(estimatedTxFee)} ${
              NETWORK.nativeToken[chain]
            }`}</FormText>
          </Row>
        </View>
      </View>
      <Row style={styles.footer}>
        <FormButton
          figure="outline"
          onPress={(): void => {
            setShowBottomSheet(false)
          }}
        >
          Reject
        </FormButton>
        <FormButton
          containerStyle={{ flex: 1 }}
          disabled={isPosting || !isValidForm}
          onPress={async (): Promise<void> => {
            navigation.push(Routes.Pin, {
              type: 'auth',
              result: async (result: boolean): Promise<void> => {
                if (result) {
                  navigation.pop()
                  const res = await onClickConfirm()
                  if (res?.success) {
                    onSubmit(selectedNft.token_uri)
                  }
                } else {
                  toast.show('PIN mismatch', { color: 'red', icon: 'info' })
                }
              },
              cancel: async (): Promise<void> => {
                navigation.pop()
                return undefined
              },
            })
          }}
        >
          Confirm
        </FormButton>
      </Row>
    </FormBottomSheet>
  )
}

export default ConfirmModal

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  itemInfo: { backgroundColor: COLOR.black._10, padding: 20 },
  txInfo: { padding: 20 },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLOR.black._90010,
    paddingVertical: 12,
    paddingHorizontal: 20,
    columnGap: 8,
  },
  fromTo: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    borderRadius: 8,
    marginBottom: 12,
  },
})
