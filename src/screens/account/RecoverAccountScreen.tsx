import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  Button,
  Text,
  TextInput,
} from '@sendbird/uikit-react-native-foundation'

import { Container, ErrorMessage } from 'components'
import useRecoverAccount from 'hooks/page/account/useRecoverAccount'

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
    <Container style={styles.container}>
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
    </Container>
  )
}

export default RecoverAccountScreen

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'space-between',
  },
})
