import React, { ReactElement } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import { Container, FormButton, FormInput } from 'components'
import useMainAccount from 'hooks/page/account/useMainAccount'

const MainAccountScreen = (): ReactElement => {
  const { navigation } = useAppNavigation()
  const { hasStoredKey, password, setPassword, isValidForm, onClickConfirm } =
    useMainAccount()

  return (
    <Container style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={{ fontSize: 40, textAlign: 'center' }}>Palm</Text>
      </View>
      <View style={{ flex: 2, padding: 20, justifyContent: 'space-between' }}>
        {hasStoredKey && (
          <View style={{ rowGap: 10 }}>
            <FormInput
              value={password}
              onChangeText={setPassword}
              textContentType="password"
              secureTextEntry
            />
            <FormButton disabled={!isValidForm} onPress={onClickConfirm}>
              Login
            </FormButton>
          </View>
        )}
        <View style={{ rowGap: 10 }}>
          <FormButton
            onPress={(): void => {
              navigation.navigate(Routes.NewAccount)
            }}>
            New Account
          </FormButton>
          <FormButton
            onPress={(): void => {
              navigation.navigate(Routes.RecoverAccount)
            }}>
            Recover Account
          </FormButton>
        </View>
      </View>
    </Container>
  )
}

export default MainAccountScreen

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'space-between',
  },
})
