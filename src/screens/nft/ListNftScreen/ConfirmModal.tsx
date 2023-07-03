import {
  FormBottomSheet,
  FormButton,
  FormImage,
  FormText,
  MoralisNftRenderer,
  Row,
} from 'components'
import { SignedNftOrderV4Serialized } from 'evm-nft-swap'
import useAuth from 'hooks/auth/useAuth'
import useProfile from 'hooks/auth/useProfile'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useToast from 'hooks/useToast'
import { UseZxListNftReturn } from 'hooks/zx/useZxListNft'
import _ from 'lodash'
import { COLOR } from 'palm-core/consts'
import { UTIL } from 'palm-core/libs'
import { Routes } from 'palm-core/libs/navigation'
import { nftUriFetcher } from 'palm-core/libs/nft'
import { stringifyMsgData } from 'palm-core/libs/sendbird'
import { Moralis, SbUserMetadata, SupportedNetworkEnum } from 'palm-core/types'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, StyleSheet, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import { useSendbirdChat } from '@sendbird/uikit-react-native'

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
    UTIL.chainIdToSupportedNetworkEnum(selectedNft.chainId || '0x1') ||
    SupportedNetworkEnum.ETHEREUM

  const { price, onClickConfirm } = useZxListNftReturn

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, channelUrl)
  const toast = useToast()
  const { t } = useTranslation()
  const { profile } = useProfile({ profileId: user?.auth?.profileId! })

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
            <FormText color={COLOR.error}>
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
              <FormText>{selectedNft.name}</FormText>
              <FormText font={'B'} size={18}>
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
              <FormImage source={UTIL.getNetworkLogo(chain)} />
              <FormText>{_.capitalize(chain)}</FormText>
            </Row>
          </Row>
          <Row
            style={{ justifyContent: 'space-between', alignItems: 'center' }}
          >
            <View>
              <View style={styles.fromTo}>
                <FormText font={'SB'}>
                  {t('Nft.ListNftConfirmModalFrom')}
                </FormText>
              </View>
              <FormText font={'B'} size={16}>
                {t('Nft.ListNftConfirmModalMe')}
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
                  {t('Nft.ListNftConfirmModalTo')}
                </FormText>
              </View>
              <Row>
                <FormText font={'B'} size={16}>
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
            navigation.navigate(Routes.Pin, {
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
