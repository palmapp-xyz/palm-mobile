import { COLOR } from 'palm-core/consts'
import { Routes } from 'palm-core/libs/navigation'
import {
  Container,
  ErrorMessage,
  FormButton,
  FormInput,
  FormModal,
  FormText,
  Header,
  MenuItem,
  Row,
} from 'palm-react-native-ui-kit/components'
import PkeyManager from 'palm-react-native/app/pkeyManager'
import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import useToast from 'palm-react-native/app/useToast'
import useRecoverAccount from 'palm-react/hooks/page/account/useRecoverAccount'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FlatList,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import Clipboard from '@react-native-clipboard/clipboard'
import { ethers } from 'ethers'
import { PALM_HOMEPAGE_URL } from 'palm-core/consts/url'
import Indicator from 'palm-react-native-ui-kit/components/atoms/Indicator'
import useWaitList from 'palm-react/hooks/app/useWaitList'
import AuthBottomSheet from './AuthBottomSheet'

export type RecoverAccountType = 'importWallet' | 'restoreWallet' | 'resetPin'

const RecoverAccountScreen = (): ReactElement => {
  const {
    usePkey,
    setUsePkey,
    privateKey,
    setPrivateKey,
    seedPhrase,
    updateSeedPhrase,
    mnemonicErrMsg,
    isValidForm,
    onClickConfirm,
  } = useRecoverAccount()
  const { navigation, params } = useAppNavigation<Routes.RecoverAccount>()
  const recoverType = params.type

  const toast = useToast()
  const { t } = useTranslation()

  const alphaConfig = useWaitList()
  const [showWaitlistModal, setShowWaitlistModal] = useState(false)
  const [showWalletLoading, setShowWalletLoading] = useState(false)
  const [showAuthenticateBottomSheet, setShowAuthenticateBottomSheet] =
    useState(false)

  const onPressConfirm = async (): Promise<void> => {
    if (alphaConfig.config?.waitlist) {
      const address = usePkey
        ? new ethers.Wallet(privateKey).publicKey
        : ethers.Wallet.fromMnemonic(seedPhrase.join(' ')).address

      const ret = alphaConfig.waitList?.includes(address.toLowerCase())
      if (!ret) {
        setShowWaitlistModal(true)
        return
      }
    }

    if (recoverType === 'resetPin') {
      const k = usePkey
        ? await PkeyManager.getPkey()
        : (await PkeyManager.getMnemonic()).split(' ')

      const match = usePkey
        ? k === privateKey
        : JSON.stringify(k) === JSON.stringify(seedPhrase)

      if (match) {
        toast.show(t('Auth.RecoverSeedVerifyPassToast'), {
          color: 'blue',
          icon: 'check',
        })
        navigation.replace(Routes.Pin, {
          type: 'reset',
          result: (result: boolean): Promise<void> => {
            result && navigation.pop()
            return Promise.resolve()
          },
          cancel: (): void => {
            navigation.pop()
          },
        })
      } else {
        toast.show(t('Auth.RecoverSeedVerifyFailToast'), {
          color: 'red',
          icon: 'info',
        })
      }
    } else {
      await onClickConfirm()
      setShowAuthenticateBottomSheet(true)
    }
  }

  const getTitleText = (): string => {
    switch (recoverType) {
      case 'importWallet':
        return t('Auth.RecoverImportWalletTitle')
      case 'restoreWallet':
        return t('Auth.RecoverRestoreWalletTitle')
      case 'resetPin':
        return t('Auth.RecoverResetPinTitle')
    }
  }

  return (
    <>
      <Container style={styles.container} keyboardAvoiding={true}>
        <Header left="back" onPressLeft={navigation.goBack} />
        <View style={styles.body}>
          <View style={{ rowGap: 8 }}>
            <FormText font={'B'} size={24} style={{ fontWeight: 'bold' }}>
              {getTitleText()}
            </FormText>
            {recoverType === 'restoreWallet' && (
              <FormText color={COLOR.black._400}>
                {t('Auth.RecoverRestoreWalletMessage')}
              </FormText>
            )}
            {recoverType === 'resetPin' && (
              <FormText color={COLOR.black._400}>
                {t('Auth.RecoverResetPinMessage')}
              </FormText>
            )}
          </View>
          <Row
            style={{
              columnGap: 8,
              paddingTop: 40,
              paddingBottom: 28,
              justifyContent: 'center',
            }}
          >
            <MenuItem
              value={true}
              title={t('Common.EnterPrivateKey')}
              selected={usePkey}
              setSelected={setUsePkey}
            />
            <MenuItem
              value={false}
              title={t('Common.SeedPhrase')}
              selected={!usePkey}
              setSelected={setUsePkey}
            />
          </Row>
          {usePkey ? (
            <View style={{ rowGap: 12 }}>
              <FormInput
                placeholder={t('Common.PrivateKey')}
                value={privateKey}
                onChangeText={setPrivateKey}
              />
              <TouchableOpacity
                onPress={(): void => {
                  Clipboard.getString().then(text => {
                    setPrivateKey(text)
                  })
                }}
              >
                <Row
                  style={{ alignItems: 'center', alignSelf: 'center', gap: 4 }}
                >
                  <Icon name="copy-outline" size={14} />
                  <FormText color={COLOR.black._500}>
                    {t('Common.PasteFromClipboard')}
                  </FormText>
                </Row>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ rowGap: 20 }}>
              <TouchableOpacity
                onPress={(): void => {
                  Clipboard.getString().then(text => {
                    updateSeedPhrase({ value: text, index: 0 })
                  })
                }}
              >
                <Row
                  style={{
                    alignItems: 'center',
                    alignSelf: 'center',
                    gap: 4,
                  }}
                >
                  <Icon name="copy-outline" size={14} />
                  <FormText color={COLOR.black._500}>
                    {t('Common.PasteFromClipboard')}
                  </FormText>
                </Row>
              </TouchableOpacity>
              <FlatList
                data={Array.from({ length: 12 })}
                numColumns={2}
                columnWrapperStyle={{ columnGap: 24 }}
                contentContainerStyle={{ rowGap: 12 }}
                keyExtractor={(item, index): string => `seedPhrase-${index}`}
                renderItem={({ index }): ReactElement => {
                  const value = seedPhrase[index]

                  return (
                    <Row style={styles.seedItem}>
                      <FormText style={{ width: 20 }}>{index + 1}</FormText>
                      <View style={{ flex: 1 }}>
                        <FormInput
                          value={value}
                          onChangeText={(newValue: string): void =>
                            updateSeedPhrase({ value: newValue, index })
                          }
                        />
                      </View>
                    </Row>
                  )
                }}
              />
              <ErrorMessage message={mnemonicErrMsg} />
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <FormButton
            size="lg"
            disabled={!isValidForm}
            onPress={(): void => {
              setShowWalletLoading(true)
              setTimeout(async () => {
                await onPressConfirm()
                setShowWalletLoading(false)
              }, 0)
            }}
          >
            {recoverType === 'importWallet'
              ? t('Auth.ImportTheWallet')
              : t('Common.Verify')}
          </FormButton>
        </View>

        {showAuthenticateBottomSheet && (
          <AuthBottomSheet
            type={recoverType === 'importWallet' ? 'imported' : 'verified'}
            show={showAuthenticateBottomSheet}
            setShow={setShowAuthenticateBottomSheet}
            onPress={(): void => {}}
          />
        )}

        <FormModal
          visible={showWaitlistModal}
          title={'Alpha Testing Underway!'}
          message={
            "We appreciate your interest in Palm!\n\nDuring our alpha testing phase, \nonly invited wallet addresses\ncan access Palm.\n\nJoin our waitlist or check back later\nfor our public launch.\nWe're excited to welcome\nyou to our community soon!"
          }
          positive={{
            text: 'Join waitlist',
            callback: (): void => {
              try {
                Linking.openURL(PALM_HOMEPAGE_URL)
              } catch {}
            },
          }}
          negative={{
            text: 'Later',
            callback: (): void => {
              setShowWaitlistModal(false)
            },
          }}
        />
      </Container>

      {(alphaConfig.config?.waitlist !== false &&
        alphaConfig.waitList === undefined) ||
        (showWalletLoading && (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: COLOR.black._90015,
            }}
          >
            <Indicator />
          </View>
        ))}
    </>
  )
}

export default RecoverAccountScreen

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { flex: 1, paddingHorizontal: 20, paddingVertical: 12 },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLOR.black._90010,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  seedItem: {
    flex: 1,
    columnGap: 4,
    alignItems: 'center',
  },
})
