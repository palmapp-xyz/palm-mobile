import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from '@sendbird/uikit-react-native-foundation'

import { AuthBody, ErrorMessage, FormButton, Row, FormInput } from 'components'
import useRecoverAccount from 'hooks/page/account/useRecoverAccount'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import { COLOR } from 'consts'

const RecoverAccountScreen = (): ReactElement => {
  const {
    privateKey,
    setPrivateKey,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    passwordConfirmErrMsg,
    isValidForm,
    onClickConfirm,
  } = useRecoverAccount()
  const { navigation } = useAppNavigation()

  return (
    <AuthBody>
      <View style={{ gap: 10 }}>
        <Text style={{ fontWeight: 'bold' }}>Recover Account</Text>
        <FormInput
          placeholder="Private key"
          value={privateKey}
          onChangeText={setPrivateKey}
        />

        <FormInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          textContentType="password"
          secureTextEntry
        />

        <FormInput
          placeholder="Confirm Password"
          value={passwordConfirm}
          onChangeText={setPasswordConfirm}
          textContentType="password"
          secureTextEntry
        />
        <ErrorMessage message={passwordConfirmErrMsg} />
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
          disabled={!isValidForm}
          onPress={onClickConfirm}>
          Recover
        </FormButton>
      </Row>
    </AuthBody>
  )
}

export default RecoverAccountScreen

const styles = StyleSheet.create({
  btnGroup: { marginHorizontal: -20, paddingTop: 20, marginBottom: -30 },
  btn: { borderRadius: 0 },
})
