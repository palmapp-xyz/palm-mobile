import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  Button,
  Text,
  TextInput,
} from '@sendbird/uikit-react-native-foundation'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ErrorMessage } from 'components'
import useNewAccount from 'hooks/page/useNewAccount'

const NewAccountScreen = (): ReactElement => {
  const {
    privateKey,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    passwordConfirmErrMsg,
    isValidForm,
    onClickConfirm,
  } = useNewAccount()

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View>
          <Text>New Account</Text>
          <Text>Private key</Text>
          <Text>{privateKey}</Text>

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
          Create
        </Button>
      </View>
    </SafeAreaView>
  )
}

export default NewAccountScreen

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
})
