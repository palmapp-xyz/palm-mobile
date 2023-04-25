import React, { ReactElement } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { COLOR } from 'consts'

import { useAppNavigation } from 'hooks/useAppNavigation'

import {
  Container,
  FormButton,
  FormInput,
  KeyboardAvoidingView,
} from 'components'
import useAuthLogin from 'hooks/page/account/useAuthLogin'
import { Routes } from 'libs/navigation'
import { AuthChallengeInfo } from 'types'

const AuthLoginScreen = (): ReactElement => {
  const { navigation } = useAppNavigation()
  const { password, setPassword, isValidForm, onClickConfirm } = useAuthLogin()

  const onPressConfirm = async (): Promise<void> => {
    await onClickConfirm(
      (challenge: AuthChallengeInfo | undefined, errMsg?: string) => {
        if (challenge) {
          navigation.replace(Routes.Sign4Auth, { challenge })
        } else {
          Alert.alert('Unknown Error', errMsg)
        }
      }
    )
  }

  return (
    <Container>
      <KeyboardAvoidingView>
        <View style={{ rowGap: 10 }}>
          <FormInput
            value={password}
            onChangeText={setPassword}
            textContentType="password"
            secureTextEntry
          />
          <TouchableOpacity style={styles.forgetPwd}>
            <Icon name="lock-closed" style={{ color: COLOR.primary._400 }} />
            <Text style={{ color: COLOR.primary._400 }}>Forgot password</Text>
          </TouchableOpacity>
          <FormButton disabled={!isValidForm} onPress={onPressConfirm}>
            Sign In
          </FormButton>
        </View>
      </KeyboardAvoidingView>
    </Container>
  )
}

export default AuthLoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgetPwd: {
    justifyContent: 'center',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
})
