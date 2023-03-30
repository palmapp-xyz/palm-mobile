import React, { ReactElement } from 'react'
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text } from '@sendbird/uikit-react-native-foundation'
import Icon from 'react-native-vector-icons/Ionicons'
import Clipboard from '@react-native-clipboard/clipboard'

import { COLOR } from 'consts'
import { AuthBody, ErrorMessage, FormButton, Row, FormInput } from 'components'
import useNewAccount from 'hooks/page/account/useNewAccount'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import Loading from 'components/atoms/Loading'
import { useRecoilState } from 'recoil'
import appStore from 'store/appStore'

const NewAccountScreen = (): ReactElement => {
  const {
    mnemonic,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    passwordConfirmErrMsg,
    isValidForm,
    onClickConfirm,
  } = useNewAccount()
  const { navigation } = useAppNavigation()

  const [loading] = useRecoilState(appStore.loading)

  if (!mnemonic || loading) {
    return <Loading />
  }

  return (
    <AuthBody>
      <View>
        <View style={styles.pkInfo}>
          <Text style={{ fontWeight: 'bold' }}>Mnemonic</Text>
          <Row style={styles.pkBox}>
            <View style={{ flex: 1, paddingVertical: 10 }}>
              <Text style={{ color: 'white', fontSize: 12 }}>{mnemonic}</Text>
            </View>
            <TouchableOpacity
              style={styles.copyBox}
              onPress={(): void => {
                Alert.alert('Copied')
                Clipboard.setString(mnemonic!)
              }}>
              <Icon name="copy-outline" color="white" size={16} />
            </TouchableOpacity>
          </Row>

          <View style={{ padding: 4 }}>
            <Text style={{ fontSize: 12 }}>
              Copy your mnemonic and keep it in a safe place. It will allow you
              to recover your wallet if you lose your password. Your generated
              wallet's mnemonic is not stored on the server and is stored on
              your mobile device.
            </Text>
          </View>
        </View>
        <View style={{ rowGap: 10 }}>
          <FormInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            textContentType="password"
            secureTextEntry
          />
          <View>
            <FormInput
              placeholder="Confirm Password"
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
              textContentType="password"
              secureTextEntry
            />
            <ErrorMessage message={passwordConfirmErrMsg} />
          </View>
        </View>
        <Row style={styles.btnGroup}>
          <FormButton
            containerStyle={[styles.btn, { backgroundColor: 'white' }]}
            textStyle={{
              color: COLOR.primary._400,
              fontWeight: '400',
              paddingHorizontal: 20,
            }}
            onPress={(): void => {
              navigation.replace(Routes.AuthMenu)
            }}>
            Cancel
          </FormButton>
          <FormButton
            containerStyle={[styles.btn, { flex: 1 }]}
            disabled={!isValidForm || loading}
            onPress={onClickConfirm}>
            Create
          </FormButton>
        </Row>
      </View>
    </AuthBody>
  )
}

export default NewAccountScreen

const styles = StyleSheet.create({
  pkInfo: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    gap: 10,
    marginBottom: 20,
  },
  copyBox: {
    width: 30,
    borderColor: 'white',
    borderLeftWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    paddingLeft: 10,
  },
  pkBox: {
    backgroundColor: COLOR.primary._400,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  btnGroup: { marginHorizontal: -20, paddingTop: 20, marginBottom: -30 },
  btn: { borderRadius: 0 },
})
