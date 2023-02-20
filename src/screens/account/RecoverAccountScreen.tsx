import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  Button,
  Text,
  TextInput,
} from '@sendbird/uikit-react-native-foundation'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ErrorMessage } from 'components'
import useRecoverAccount from 'hooks/page/useRecoverAccount'

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

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View>
          <Text>Recover Account</Text>
          <Text>Private key</Text>
          <TextInput value={privateKey} onChangeText={setPrivateKey} />

          <Text>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            textContentType="password"
            secureTextEntry
          />

          <Text>Confirm Password</Text>
          <TextInput
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
            textContentType="password"
            secureTextEntry
          />
          <ErrorMessage message={passwordConfirmErrMsg} />
        </View>
        <Button disabled={!isValidForm} onPress={onClickConfirm}>
          Recover
        </Button>
      </View>
    </SafeAreaView>
  )
}

export default RecoverAccountScreen

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
})
