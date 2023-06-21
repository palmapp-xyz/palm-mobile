import {
  FormBottomSheet,
  FormButton,
  FormImage,
  FormText,
  MoralisNftRenderer,
  Row,
} from 'components'
import { COLOR, NETWORK, UTIL } from 'consts'
import { SignedNftOrderV4Serialized } from 'evm-nft-swap'
import useAuth from 'hooks/auth/useAuth'
import useProfile from 'hooks/auth/useProfile'
import { UseZxListNftReturn } from 'hooks/zx/useZxListNft'
import { nftUriFetcher } from 'libs/nft'
import { stringifyMsgData } from 'libs/sendbird'
import { chainIdToSupportedNetworkEnum } from 'libs/utils'
import _ from 'lodash'
import React, { ReactElement } from 'react'
import { Keyboard, StyleSheet, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Moralis, SbUserMetadata, SupportedNetworkEnum } from 'types'

import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import { useSendbirdChat } from '@sendbird/uikit-react-native'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useToast from 'hooks/useToast'
import { Routes } from 'libs/navigation'
import { useTranslation } from 'react-i18next'

const ConfirmModal = ({
  selectedNft,
  channelUrl,
  showBottomSheet,
  setShowBottomSheet,
  useZxListNftReturn,
}: {
  selectedNft: Moralis.NftItem
  channelUrl: string
  showBottomSheet: boolean
  setShowBottomSheet: React.Dispatch<React.SetStateAction<boolean>>
  useZxListNftReturn: UseZxListNftReturn
}): ReactElement => {
  const { user } = useAuth()
  const { navigation } = useAppNavigation<Routes.SendNft>()
  const chain: SupportedNetworkEnum =
    chainIdToSupportedNetworkEnum(selectedNft.chainId || '0x1') ||
    SupportedNetworkEnum.ETHEREUM

  const { price, onClickConfirm } = useZxListNftReturn

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, channelUrl)
  const toast = useToast()
  const { t } = useTranslation()
  const { profile } = useProfile({ profileId: user?.auth?.profileId })

  const onSubmit = async (
    token_uri: string,
    order: SignedNftOrderV4Serialized | undefined
  ): Promise<void> => {
    if (!channel || !order || !profile) {
      return
    }

    const imgInfo = await nftUriFetcher(token_uri)

    imgInfo.data = stringifyMsgData({
      type: 'list',
      selectedNft,
      nonce: order.nonce,
      amount: UTIL.microfyP(price),
      owner: {
        profileId: profile.profileId,
        handle: profile.handle,
        address: profile.address,
      } as SbUserMetadata,
    })
    channel.sendFileMessage(imgInfo)
  }

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
              {t('Nft.ListNftConfirmModalNotice')}
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
              <FormText>{t('Nft.ListNftConfirmModalOn')}</FormText>
              <FormImage source={NETWORK.getNetworkLogo(chain)} />
              <FormText>{_.capitalize(chain)}</FormText>
            </Row>
          </Row>
          <Row
            style={{ justifyContent: 'space-between', alignItems: 'center' }}
          >
            <View>
              <View style={styles.fromTo}>
                <FormText fontType="SB.12">
                  {t('Nft.ListNftConfirmModalFrom')}
                </FormText>
              </View>
              <FormText fontType="B.16">
                {t('Nft.ListNftConfirmModalMe')}
              </FormText>
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
                <FormText fontType="SB.12">
                  {t('Nft.ListNftConfirmModalTo')}
                </FormText>
              </View>
              <Row>
                <FormText fontType="B.16">
                  {t('Nft.ListNftConfirmModalListContract')}
                </FormText>
              </Row>
            </View>
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
          disabled={!profile}
          onPress={async (): Promise<void> => {
            Keyboard.dismiss()
            navigation.push(Routes.Pin, {
              type: 'auth',
              result: async (result: boolean): Promise<void> => {
                if (result) {
                  navigation.pop()
                  const order = await onClickConfirm()
                  onSubmit(selectedNft.token_uri, order)
                } else {
                  toast.show(t('Nft.PinMismatchToast'), {
                    color: 'red',
                    icon: 'info',
                  })
                }
              },
              cancel: (): void => {
                navigation.pop()
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
