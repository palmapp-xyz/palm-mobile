import {
  Container,
  ErrorMessage,
  FormButton,
  FormInput,
  FormText,
  Header,
  MenuItem,
  Row,
} from 'components'
import Loading from 'components/atoms/Loading'
import { COLOR } from 'core/consts'
import { getMnemonic, getPkey } from 'core/libs/account'
import { Routes } from 'core/libs/navigation'
import appStore from 'core/store/appStore'
import useRecoverAccount from 'hooks/page/account/useRecoverAccount'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useToast from 'hooks/useToast'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useRecoilState } from 'recoil'

import Clipboard from '@react-native-clipboard/clipboard'

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

  const [loading, setLoading] = useRecoilState(appStore.loading)

  const onPressConfirm = async (): Promise<void> => {
    if (recoverType === 'resetPin') {
      const k = usePkey ? await getPkey() : (await getMnemonic()).split(' ')

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
      navigation.push(Routes.Pin, {
        type: 'set',
        result: async (result: boolean): Promise<void> => {
          if (result === true) {
            setLoading(true)
            setTimeout(async () => {
              await onClickConfirm()
              setLoading(false)
              navigation.replace(Routes.Sign4Auth)
            }, 100)
          }

          return Promise.resolve()
        },
        cancel: () => {
          navigation.pop()
        },
      })
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

  if (loading) {
    return <Loading />
  }

  return (
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
              <Row style={{ alignItems: 'center', alignSelf: 'center' }}>
                <Icon name="copy-outline" size={14} />
                <FormText>{t('Common.PasteFromClipboard')}</FormText>
              </Row>
            </TouchableOpacity>
          </View>
        ) : (
          <>
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
          </>
        )}
      </View>

      <View style={styles.footer}>
        <FormButton
          size="lg"
          disabled={!isValidForm || loading}
          onPress={onPressConfirm}
        >
          {recoverType === 'importWallet'
            ? t('Auth.ImportTheWallet')
            : t('Common.Verify')}
        </FormButton>
      </View>
    </Container>
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
