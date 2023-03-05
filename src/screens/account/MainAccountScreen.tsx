import React, { ReactElement, useState } from 'react'
import {
  ImageBackground,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { COLOR } from 'consts'

import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import { Container, FormButton, FormInput, Row } from 'components'
import useMainAccount from 'hooks/page/account/useMainAccount'
import images from 'assets/images'

const MainAccountScreen = (): ReactElement => {
  const [isSecondPage, setIsSecondPage] = useState(true)
  const { navigation } = useAppNavigation()
  const { hasStoredKey, password, setPassword, isValidForm, onClickConfirm } =
    useMainAccount()

  return (
    <ImageBackground source={images.splash} style={{ flex: 1 }}>
      <Container style={styles.container}>
        <KeyboardAvoidingView>
          <View
            style={{
              backgroundColor: '#ffffff99',
              padding: 20,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              marginBottom: -40,
              paddingBottom: 70,
            }}>
            {hasStoredKey && isSecondPage ? (
              <View style={{ rowGap: 10 }}>
                <FormInput
                  value={password}
                  onChangeText={setPassword}
                  textContentType="password"
                  secureTextEntry
                />
                <TouchableOpacity
                  style={{
                    justifyContent: 'center',
                    paddingVertical: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    columnGap: 10,
                  }}
                  onPress={(): void => {
                    setIsSecondPage(false)
                  }}>
                  <Icon
                    name="lock-closed"
                    style={{ color: COLOR.primary._400 }}
                  />
                  <Text style={{ color: COLOR.primary._400 }}>
                    Forgot password
                  </Text>
                </TouchableOpacity>
                <FormButton disabled={!isValidForm} onPress={onClickConfirm}>
                  Sign In With Lens
                </FormButton>
              </View>
            ) : (
              <View style={{ rowGap: 10 }}>
                <FormButton
                  onPress={(): void => {
                    setIsSecondPage(true)
                  }}>
                  Sign In
                </FormButton>
                <Row style={{ columnGap: 10 }}>
                  <FormButton
                    containerStyle={{ backgroundColor: 'white', flex: 1 }}
                    textStyle={{ color: COLOR.primary._400 }}
                    onPress={(): void => {
                      navigation.navigate(Routes.NewAccount)
                    }}>
                    New Account
                  </FormButton>
                  <FormButton
                    containerStyle={{ backgroundColor: 'white', flex: 1 }}
                    textStyle={{ color: COLOR.primary._400 }}
                    onPress={(): void => {
                      navigation.navigate(Routes.RecoverAccount)
                    }}>
                    Recover Account
                  </FormButton>
                </Row>
                <TouchableOpacity
                  style={{
                    justifyContent: 'center',
                    paddingVertical: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    columnGap: 10,
                  }}
                  onPress={(): void => {}}>
                  <Icon
                    name="checkmark-circle"
                    style={{ color: COLOR.primary._400 }}
                  />
                  <Text style={{ color: COLOR.primary._400 }}>
                    About palm service
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </Container>
    </ImageBackground>
  )
}

export default MainAccountScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
})
