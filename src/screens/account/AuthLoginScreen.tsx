import React, { ReactElement } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { COLOR } from 'consts'

import { useAppNavigation } from 'hooks/useAppNavigation'

import {
  AuthBody,
  FormButton,
  FormInput,
  KeyboardAvoidingView,
} from 'components'
import useAuthLogin from 'hooks/page/account/useAuthLogin'
import { Routes } from 'libs/navigation'
import NetworkOptions from 'components/molecules/NetworkOptions'

const AuthLoginScreen = (): ReactElement => {
  const { navigation } = useAppNavigation()
  const { password, setPassword, isValidForm, onClickConfirm } = useAuthLogin()

  return (
    <AuthBody>
      <KeyboardAvoidingView>
        <View style={{ rowGap: 10 }}>
          <FormInput
            value={password}
            onChangeText={setPassword}
            textContentType="password"
            secureTextEntry
          />
          <TouchableOpacity
            style={styles.forgetPwd}
            onPress={(): void => {
              navigation.replace(Routes.AuthMenu)
            }}>
            <Icon name="lock-closed" style={{ color: COLOR.primary._400 }} />
            <Text style={{ color: COLOR.primary._400 }}>Forgot password</Text>
          </TouchableOpacity>
          <FormButton disabled={!isValidForm} onPress={onClickConfirm}>
            Sign In With Lens
          </FormButton>
          <Text>Change Network</Text>
          <NetworkOptions />
        </View>
      </KeyboardAvoidingView>
    </AuthBody>
  )
}

export default AuthLoginScreen

const styles = StyleSheet.create({
  forgetPwd: {
    justifyContent: 'center',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
})
