import _ from 'lodash'
import { COLOR, NETWORK } from 'palm-core/consts'
import { UTIL } from 'palm-core/libs'
import { getProfileDoc } from 'palm-core/libs/firebase'
import { getProfileMediaImg } from 'palm-core/libs/lens'
import { Routes } from 'palm-core/libs/navigation'
import { stringifyMsgData } from 'palm-core/libs/sendbird'
import {
  FbProfile,
  Moralis,
  PostTxReturn,
  SbUserMetadata,
  SupportedNetworkEnum,
  Token,
  pToken,
} from 'palm-core/types'
import {
  FormBottomSheet,
  FormButton,
  FormImage,
  FormText,
  MediaRenderer,
  Row,
} from 'palm-react-native-ui-kit/components'
import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import useToast from 'palm-react-native/app/useToast'
import useAuth from 'palm-react/hooks/auth/useAuth'
import useProfile from 'palm-react/hooks/auth/useProfile'
import useSendToken from 'palm-react/hooks/page/groupChannel/useSendToken'
import images from 'palm-ui-kit/assets/images'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

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
  const { profile } = useProfile({ profileId: user?.auth?.profileId! })

  const [receiver, setReceiver] = useState<FbProfile>()
  const chain: SupportedNetworkEnum =
    UTIL.chainIdToSupportedNetworkEnum(selectedToken.chainId || '0x1') ||
    SupportedNetworkEnum.ETHEREUM

  const { navigation } = useAppNavigation<Routes.SendNft>()
  const toast = useToast()
  const { t } = useTranslation()

  const receiverProfileImg = getProfileMediaImg(receiver?.picture)
  const senderProfileImg = getProfileMediaImg(profile?.picture)
  const { isPosting, isValidForm, onClickConfirm, estimatedTxFee } =
    useSendToken({
      selectedToken,
      receiver: receiver?.address,
      value: UTIL.microfyP(value),
    })

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, channelUrl ?? receiverId)

  const isMainnet = UTIL.isMainnet()
  const tokenSymbol = NETWORK.nativeToken[chain]
  const txFee = UTIL.demicrofyP(estimatedTxFee)
  const total = UTIL.toBn(value).plus(txFee).toString()
  const valueToUsd = UTIL.formatAmountP(
    UTIL.getTokenBalanceInUSD(
      UTIL.microfyP(UTIL.removeCommasToNumber(value) as Token),
      selectedToken.price
    ) as pToken,
    {
      toFix: 2,
    }
  )
  const totalToUsd = UTIL.formatAmountP(
    UTIL.getTokenBalanceInUSD(
      UTIL.microfyP(UTIL.removeCommasToNumber(total) as Token),
      selectedToken.price
    ) as pToken,
    {
      toFix: 2,
    }
  )

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
    const _receiver = await getProfileDoc(receiverId)
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
          <View style={styles.notice}>
            <FormText color={COLOR.error}>
              {t('Nft.SendTokenConfirmModalNotice')}
            </FormText>
          </View>
        </View>
        <View style={styles.itemInfo}>
          <View
            style={{ flexDirection: 'column', columnGap: 12, marginBottom: 24 }}
          >
            <Row style={styles.tokenRow}>
              <FormText size={24} font="B">
                {UTIL.addCommasToNumber(value)}
              </FormText>
              <View style={styles.token}>
                <FormImage
                  source={{ uri: selectedToken.logo ?? images.palm_logo }}
                  size={20}
                />
                <FormText size={20} font="B">
                  {tokenSymbol}
                </FormText>
              </View>
            </Row>
            {valueToUsd && (
              <FormText size={12} color={COLOR.black._400}>
                {t('Common.UsdPrice', {
                  price: valueToUsd,
                })}
              </FormText>
            )}
          </View>
          <Row style={styles.separateView}>
            <View style={styles.separateLine} />
            <Row style={styles.separateRow}>
              <FormText color={COLOR.black._400}>
                {t('Nft.SendTokenConfirmModalOn')}
              </FormText>
              <FormImage source={UTIL.getNetworkLogo(chain)} />
              <FormText color={COLOR.black._400}>{`${_.capitalize(chain)} ${
                isMainnet ? 'MainNet' : 'TestNet'
              }`}</FormText>
            </Row>
          </Row>
          <Row style={styles.userRow}>
            <View style={{ flex: 1 }}>
              <Row style={styles.userImageRow}>
                {senderProfileImg ? (
                  <MediaRenderer
                    src={senderProfileImg}
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
                <FormText font={'B'} size={16} numberOfLines={1}>
                  {t('Nft.SendTokenConfirmModalMe')}
                </FormText>
              </Row>
              <FormText color={COLOR.black._300}>{`(${UTIL.truncate(
                user?.address || ''
              )})`}</FormText>
            </View>

            <View style={{ marginHorizontal: 12 }}>
              <Ionicons
                name="arrow-forward"
                size={28}
                color={COLOR.black._200}
              />
            </View>

            <View style={{ flex: 1, marginRight: 20 }}>
              <Row style={styles.userImageRow}>
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
                <FormText font={'B'} size={16} numberOfLines={1}>
                  {receiver?.handle}
                </FormText>
              </Row>
              <FormText color={COLOR.black._300}>
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
            <Row style={{ gap: 2 }}>
              <FormText>{txFee}</FormText>
              <FormText color={COLOR.black._300}>{tokenSymbol}</FormText>
            </Row>
          </Row>
          <Row style={{ justifyContent: 'space-between' }}>
            <FormText font={'B'}>{t('Nft.Total')}</FormText>
            <Row style={{ gap: 2 }}>
              <FormText>{total}</FormText>
              <FormText color={COLOR.black._300}>{tokenSymbol}</FormText>
            </Row>
          </Row>
          {totalToUsd && (
            <FormText
              size={12}
              color={COLOR.black._400}
              style={{ alignSelf: 'flex-end' }}
            >
              {t('Common.UsdPrice', {
                price: totalToUsd,
              })}
            </FormText>
          )}
        </View>
      </View>
      <Row style={styles.footer}>
        <FormButton
          font="B"
          containerStyle={{ flex: 1 }}
          figure="outline"
          onPress={(): void => {
            setShowBottomSheet(false)
          }}
        >
          {t('Common.Reject')}
        </FormButton>
        <FormButton
          font="B"
          containerStyle={{ flex: 3 }}
          disabled={!receiver || !profile || isPosting || !isValidForm}
          onPress={async (): Promise<void> => {
            navigation.navigate(Routes.Pin, {
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
  notice: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FF002E0d',
    borderRadius: 14,
  },
  itemInfo: { backgroundColor: COLOR.black._10, padding: 20 },
  txInfo: { padding: 20, gap: 12 },
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
  separateView: {
    position: 'relative',
    justifyContent: 'center',
    marginBottom: 12,
  },
  separateLine: {
    position: 'absolute',
    borderWidth: 0.5,
    borderColor: COLOR.black._200,
    width: '100%',
    top: 12,
  },
  separateRow: {
    alignItems: 'center',
    columnGap: 4,
    marginBottom: 12,
    backgroundColor: COLOR.black._10,
    paddingHorizontal: 20,
  },
  tokenRow: { justifyContent: 'space-between', alignItems: 'center' },
  userRow: { justifyContent: 'space-between', alignItems: 'center' },
  userImageRow: { gap: 8, alignItems: 'center' },
  token: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 6,
    backgroundColor: COLOR.black._90005,
    borderRadius: 12,
  },
})
