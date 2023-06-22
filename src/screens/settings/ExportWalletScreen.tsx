import { Container, FormText, Header } from 'components'
import { COLOR } from 'consts'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { getMnemonic, getPkey } from 'libs/account'
import { Routes } from 'libs/navigation'
import React, { ReactElement, useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import Clipboard from '@react-native-clipboard/clipboard'
import useAuth from 'hooks/auth/useAuth'
import useToast from 'hooks/useToast'
import { useTranslation } from 'react-i18next'

const ExportWalletScreen = (): ReactElement => {
  const { navigation } = useAppNavigation<Routes.ExportWallet>()
  const { user } = useAuth()
  const [privateKey, setPrivateKey] = useState('')
  const [mnemonic, setMnemonic] = useState('')
  const toast = useToast()
  const { t } = useTranslation()

  const displayKey = mnemonic || privateKey

  useEffect(() => {
    getPkey().then(key => setPrivateKey(key))
    getMnemonic().then(m => setMnemonic(m))
  }, [])

  return (
    <Container style={styles.container}>
      <Header left="back" onPressLeft={navigation.goBack} />
      <View style={styles.body}>
        <FormText
          fontType="B.24"
          color={COLOR.black._900}
          style={{ marginBottom: 40 }}
        >
          {t('Settings.ExportWalletHeaderTitle')}
        </FormText>
        <FormText fontType="R.12" color={COLOR.black._400}>
          {t('Settings.ExportWalletWalletAddress')}
        </FormText>
        <View style={styles.addressBox}>
          <FormText fontType="R.14" color={COLOR.black._900} numberOfLines={1}>
            {user?.address}
          </FormText>
        </View>

        <FormText fontType="R.12" color={COLOR.black._400}>
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
              fontType="R.14"
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
          <FormText
            fontType="R.12"
            color={COLOR.red}
            style={{ marginRight: 8 }}
          >
            {'•'}
          </FormText>
          <FormText fontType="R.12" color={COLOR.red}>
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
