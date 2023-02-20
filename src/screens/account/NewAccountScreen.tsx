import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import { Text, TextInput } from '@sendbird/uikit-react-native-foundation'

import { Container, ErrorMessage, FormButton } from 'components'
import useNewAccount from 'hooks/page/account/useNewAccount'

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
    <Container style={styles.container}>
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
      <FormButton disabled={!isValidForm} onPress={onClickConfirm}>
        Create
      </FormButton>
    </Container>
  )
}

export default NewAccountScreen

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'space-between',
  },
})
