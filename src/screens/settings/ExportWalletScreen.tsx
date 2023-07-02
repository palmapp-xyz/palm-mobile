import { Container, FormText, Header } from 'components'
import useAuth from 'hooks/auth/useAuth'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useToast from 'hooks/useToast'
import { COLOR } from 'palm-core/consts'
import { Routes } from 'palm-core/libs/navigation'
import PkeyManager from 'palm-react-native/app/pkeyManager'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import Clipboard from '@react-native-clipboard/clipboard'

const ExportWalletScreen = (): ReactElement => {
  const { navigation } = useAppNavigation<Routes.ExportWallet>()
  const { user } = useAuth()
  const [privateKey, setPrivateKey] = useState('')
  const [mnemonic, setMnemonic] = useState('')
  const toast = useToast()
  const { t } = useTranslation()

  const displayKey = mnemonic || privateKey

  useEffect(() => {
    PkeyManager.getPkey().then(key => setPrivateKey(key))
    PkeyManager.getMnemonic().then(m => setMnemonic(m))
  }, [])

  return (
    <Container style={styles.container}>
      <Header left="back" onPressLeft={navigation.goBack} />
      <View style={styles.body}>
        <FormText
          font="B"
          size={24}
          color={COLOR.black._900}
          style={{ marginBottom: 40 }}
        >
          {t('Settings.ExportWalletHeaderTitle')}
        </FormText>
        <FormText size={12} color={COLOR.black._400}>
          {t('Settings.ExportWalletWalletAddress')}
        </FormText>
        <View style={styles.addressBox}>
          <FormText color={COLOR.black._900} numberOfLines={1}>
            {user?.address}
          </FormText>
        </View>

        <FormText size={12} color={COLOR.black._400}>
          {t('Settings.ExportWalletPrivateKey')}
        </FormText>
        <TouchableOpacity
          onPress={(): void => {
            toast.show(t('Settings.ExportWalletCopiedPrivateKeyToast'), {
              color: 'green',
              icon: 'check',
            })
            Clipboard.setString(displayKey)
          }}
        >
          <View style={styles.keyBox}>
            <FormText
              color={COLOR.black._900}
              style={{ flex: 1, paddingRight: 16 }}
            >
              {privateKey}
            </FormText>
            <MaterialIcons
              name="content-copy"
              size={18}
              color={COLOR.black._200}
            />
          </View>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <FormText size={12} color={COLOR.red} style={{ marginRight: 8 }}>
            {'•'}
          </FormText>
          <FormText size={12} color={COLOR.red}>
            {t('Settings.ExportWalletNeverDisclose')}
          </FormText>
        </View>
      </View>
    </Container>
  )
}

export default ExportWalletScreen

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { padding: 20, gap: 8 },
  addressBox: {
    backgroundColor: COLOR.black._90005,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  keyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    borderColor: COLOR.black._90010,
    backgroundColor: COLOR.white,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  infoBox: {
    flexDirection: 'row',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: `${COLOR.red}${COLOR.opacity._05}`,
  },
})
