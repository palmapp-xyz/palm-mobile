import images from 'assets/images'
import {
  FormBottomSheet,
  FormButton,
  FormImage,
  FormText,
  MediaRenderer,
  Row,
} from 'components'
import MoralisErc20Token from 'components/MoralisErc20Token'
import { COLOR, NETWORK, UTIL } from 'core/consts'
import useAuth from 'hooks/auth/useAuth'
import useProfile from 'hooks/auth/useProfile'
import useSendToken from 'hooks/page/groupChannel/useSendToken'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useToast from 'hooks/useToast'
import { getFsProfile } from 'libs/firebase'
import { getProfileMediaImg } from 'libs/lens'
import { Routes } from 'libs/navigation'
import { stringifyMsgData } from 'libs/sendbird'
import { chainIdToSupportedNetworkEnum } from 'libs/utils'
import _ from 'lodash'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {
  FbProfile,
  Moralis,
  PostTxReturn,
  SbUserMetadata,
  SupportedNetworkEnum,
  Token,
} from 'types'

import { MentionType, UserMessageCreateParams } from '@sendbird/chat/message'
import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import { useSendbirdChat } from '@sendbird/uikit-react-native'
import { useAsyncEffect } from '@sendbird/uikit-utils'

const ConfirmModal = ({
  selectedToken,
  receiverId,
  value,
  channelUrl,
  showBottomSheet,
  setShowBottomSheet,
}: {
  selectedToken: Moralis.FtItem
  receiverId: string
  value: Token
  channelUrl?: string
  showBottomSheet: boolean
  setShowBottomSheet: React.Dispatch<React.SetStateAction<boolean>>
}): ReactElement => {
  const { user } = useAuth()
  const { profile } = useProfile({ profileId: user?.auth?.profileId })

  const [receiver, setReceiver] = useState<FbProfile>()
  const chain: SupportedNetworkEnum =
    chainIdToSupportedNetworkEnum(selectedToken.chainId || '0x1') ||
    SupportedNetworkEnum.ETHEREUM

  const { navigation } = useAppNavigation<Routes.SendNft>()
  const toast = useToast()
  const { t } = useTranslation()

  const receiverProfileImg = getProfileMediaImg(receiver?.picture)
  const { isPosting, isValidForm, onClickConfirm, estimatedTxFee } =
    useSendToken({
      selectedToken,
      receiver: receiver?.address,
      value: UTIL.microfyP(value),
    })

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, channelUrl ?? receiverId)

  const onSubmit = async (res: PostTxReturn | undefined): Promise<void> => {
    if (!res || !channel || !profile || !receiver) {
      return
    }

    if (!res.success) {
      toast.hideAll()
      toast.show(t('Nft.SendTokenConfirmModalFailedToast'), {
        color: 'red',
        icon: 'info',
      })
      return
    }

    const msg: UserMessageCreateParams = {
      message: `@${profile!.handle} sent ${value} ${selectedToken.logo} to @${
        receiver!.handle
      }`,
      data: stringifyMsgData({
        type: 'send-token',
        selectedToken,
        value: UTIL.microfyP(value),
        txHash: res.receipt.transactionHash,
        from: {
          profileId: profile.profileId,
          handle: profile.handle,
          address: profile.address,
        } as SbUserMetadata,
        to: {
          profileId: receiver.profileId,
          handle: receiver.handle,
          address: receiver.address,
        } as SbUserMetadata,
      }),
      customType: 'send-token',
      mentionType: MentionType.USERS,
      mentionedUserIds: [user!.auth!.profileId, receiverId],
    }
    channel.sendUserMessage(msg)
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
            <FormText color={COLOR.error}>
              {t('Nft.SendTokenConfirmModalNotice')}
            </FormText>
          </View>
        </View>
        <View style={styles.itemInfo}>
          <Row style={{ columnGap: 12, marginBottom: 24 }}>
            <MoralisErc20Token
              item={selectedToken}
              value={UTIL.microfyP(value)}
            />
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
              <FormText>{t('Nft.SendTokenConfirmModalOn')}</FormText>
              <FormImage source={NETWORK.getNetworkLogo(chain)} />
              <FormText>{_.capitalize(chain)}</FormText>
            </Row>
          </Row>
          <Row
            style={{ justifyContent: 'space-between', alignItems: 'center' }}
          >
            <View>
              <View style={styles.fromTo}>
                <FormText font={'SB'}>
                  {t('Nft.SendTokenConfirmModalFrom')}
                </FormText>
              </View>
              <FormText font={'B'} size={16}>
                {t('Nft.SendTokenConfirmModalMe')}
              </FormText>
              <FormText>{`(${UTIL.truncate(user?.address || '')})`}</FormText>
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
                <FormText font={'SB'}>
                  {t('Nft.SendTokenConfirmModalTo')}
                </FormText>
              </View>
              <Row style={{ columnGap: 6 }}>
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
                <FormText font={'B'} size={16}>
                  {receiver?.handle}
                </FormText>
              </Row>
              <FormText>
                {`(${UTIL.truncate(receiver?.address || '')})`}
              </FormText>
            </View>
          </Row>
        </View>
        <View style={styles.txInfo}>
          <Row style={{ justifyContent: 'space-between' }}>
            <FormText font={'B'}>
              {t('Nft.SendTokenConfirmModalEstGasFee')}
            </FormText>
            <FormText>{`${UTIL.demicrofyP(estimatedTxFee)} ${
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
          {t('Common.Reject')}
        </FormButton>
        <FormButton
          containerStyle={{ flex: 1 }}
          disabled={!receiver || !profile || isPosting || !isValidForm}
          onPress={async (): Promise<void> => {
            navigation.push(Routes.Pin, {
              type: 'auth',
              result: async (result: boolean): Promise<void> => {
                if (result) {
                  navigation.pop()
                  const res = await onClickConfirm()
                  onSubmit(res)
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
          {t('Common.Confirm')}
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
