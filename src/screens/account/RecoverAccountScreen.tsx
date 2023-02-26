import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import { Text, TextInput } from '@sendbird/uikit-react-native-foundation'
import Icon from 'react-native-vector-icons/Ionicons'

import { COLOR } from 'consts'
import { Container, ErrorMessage, FormButton, Header } from 'components'
import useRecoverAccount from 'hooks/page/account/useRecoverAccount'
import { useAppNavigation } from 'hooks/useAppNavigation'

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
    <Container style={styles.container}>
      <Header
        title="Recover"
        left={
          <Icon name="ios-chevron-back" color={COLOR.gray._800} size={20} />
        }
        onPressLeft={navigation.goBack}
      />
      <View style={styles.body}>
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
        <FormButton disabled={!isValidForm} onPress={onClickConfirm}>
          Recover
        </FormButton>
      </View>
    </Container>
  )
}

export default RecoverAccountScreen

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: {
    padding: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
})
