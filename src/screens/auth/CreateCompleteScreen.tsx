import { Container, FormButton, FormText, Header } from 'components'
import Loading from 'components/atoms/Loading'
import { COLOR } from 'consts'
import useCreateComplete from 'hooks/page/account/useCreateComplete'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import React, { ReactElement } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useRecoilState } from 'recoil'
import appStore from 'store/appStore'

import Clipboard from '@react-native-clipboard/clipboard'
import useToast from 'hooks/useToast'

const CreateCompleteScreen = (): ReactElement => {
  const { navigation } = useAppNavigation<Routes.CreateComplete>()
  const { account } = useCreateComplete()
  const toast = useToast()

  const [loading] = useRecoilState(appStore.loading)

  const onPressConfirm = async (): Promise<void> => {
    navigation.replace(Routes.Sign4Auth)
  }

  if (loading) {
    return <Loading />
  }

  return (
    <Container style={styles.container}>
      <Header left="back" onPressLeft={navigation.goBack} />

      <View style={styles.body}>
        <View style={{ rowGap: 8, paddingBottom: 40 }}>
          <FormText fontType="B.24" style={{ fontWeight: 'bold' }}>
            {'Wallet creation\nis complete'}
          </FormText>
          <FormText color={COLOR.black._400} fontType="R.14">
            {
              'Wallet information is as follows.\nYou can check it later on My Page.'
            }
          </FormText>
        </View>
        <View style={{ rowGap: 12 }}>
          <View style={styles.rowSection}>
            <FormText fontType="R.12">Wallet Address</FormText>
            <TouchableOpacity
              style={styles.copyBox}
              onPress={(): void => {
                toast.show('Address copied', { color: 'green', icon: 'check' })
                Clipboard.setString(account?.address || '')
              }}
            >
              <View style={{ flex: 1 }}>
                <FormText fontType="R.14">{account?.address}</FormText>
              </View>
              <Icon name="copy-outline" size={20} />
            </TouchableOpacity>
          </View>
          <View style={styles.rowSection}>
            <View style={styles.infoBox}>
              <FormText fontType="R.12">
                {`· Click to sign in and accept the Palm Terms of Service. 
· This request will not trigger a blockchain 
  transaction or cost any gas fees. 
· Your authentication status will reset after 24 
  hours.`}
              </FormText>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <FormButton size="lg" disabled={loading} onPress={onPressConfirm}>
          Next
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
