import { COLOR } from 'palm-core/consts'
import { Routes } from 'palm-core/libs/navigation'
import {
  Container,
  DotListItemText,
  FormButton,
  FormText,
  Header,
} from 'palm-react-native-ui-kit/components'
import Loading from 'palm-react-native-ui-kit/components/atoms/Loading'
import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import useToast from 'palm-react-native/app/useToast'
import useCreateComplete from 'palm-react/hooks/page/account/useCreateComplete'
import appStore from 'palm-react/store/appStore'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useRecoilState } from 'recoil'

import Clipboard from '@react-native-clipboard/clipboard'
import { PALM_TERMS_OF_SERVICE_URL } from 'palm-core/consts/url'
import AuthBottomSheet from './AuthBottomSheet'

const CreateCompleteScreen = (): ReactElement => {
  const { navigation } = useAppNavigation<Routes.CreateComplete>()
  const { account } = useCreateComplete()
  const toast = useToast()
  const { t } = useTranslation()

  const [loading] = useRecoilState(appStore.loading)

  const [showAuthenticateBottomSheet, setShowAuthenticateBottomSheet] =
    useState(false)

  const onPressConfirm = async (): Promise<void> => {
    setShowAuthenticateBottomSheet(true)
  }

  if (loading) {
    return <Loading />
  }

  return (
    <Container style={styles.container}>
      <Header left="back" onPressLeft={navigation.goBack} />

      <View style={styles.body}>
        <View style={{ rowGap: 8, paddingBottom: 40 }}>
          <FormText font={'B'} size={24} style={{ fontWeight: 'bold' }}>
            {t('Auth.Complete')}
          </FormText>
          <FormText color={COLOR.black._400}>
            {t('Auth.CompleteMessage')}
          </FormText>
        </View>
        <View style={{ rowGap: 12 }}>
          <View style={styles.rowSection}>
            <FormText>{t('Common.WalletAddress')}</FormText>
            <TouchableOpacity
              style={styles.copyBox}
              onPress={(): void => {
                toast.show(t('Auth.CompleteCopiedAddressToast'), {
                  color: 'green',
                  icon: 'check',
                })
                Clipboard.setString(account?.address || '')
              }}
            >
              <View style={{ flex: 1 }}>
                <FormText>{account?.address}</FormText>
              </View>
              <Icon name="copy-outline" size={20} />
            </TouchableOpacity>
          </View>
          <View style={styles.rowSection}>
            <View style={styles.infoBox}>
              <DotListItemText
                startText={t('Auth.PalmToS1Start')}
                endText=""
                linkText={t('Auth.PalmToS1Link')}
                linkUrl={PALM_TERMS_OF_SERVICE_URL}
              />
              <DotListItemText text={t('Auth.PalmToS2')} />
              <DotListItemText text={t('Auth.PalmToS3')} />
            </View>
          </View>
        </View>
      </View>

      {showAuthenticateBottomSheet && (
        <AuthBottomSheet
          type={'imported'}
          show={showAuthenticateBottomSheet}
          setShow={setShowAuthenticateBottomSheet}
          onPress={(): void => {}}
        />
      )}

      <View style={styles.footer}>
        <FormButton size="lg" disabled={loading} onPress={onPressConfirm}>
          {t('Common.Next')}
        </FormButton>
      </View>
    </Container>
  )
}

export default CreateCompleteScreen

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
  copyBox: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLOR.black._200,
    paddingHorizontal: 10,
    paddingVertical: 12,
    columnGap: 16,
    alignItems: 'center',
    borderRadius: 14,
  },
  rowSection: {
    rowGap: 4,
  },
  infoBox: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLOR.black._90010,
  },
})
