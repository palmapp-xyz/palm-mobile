import React, { ReactElement } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import { FormButton, FormInput } from 'components'
import useMainAccount from 'hooks/page/useMainAccount'

const MainAccountScreen = (): ReactElement => {
  const { navigation } = useAppNavigation()
  const { password, setPassword, isValidForm, onClickConfirm } =
    useMainAccount()

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{ fontSize: 40, textAlign: 'center' }}>Palm</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <View>
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
          <View>
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
      </View>
    </SafeAreaView>
  )
}

export default MainAccountScreen

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
})
