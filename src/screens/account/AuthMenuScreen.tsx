import React, { ReactElement } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { COLOR } from 'consts'

import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'

import { AuthBody, FormButton, Row } from 'components'
import { KeyChainEnum } from 'types'
import { useQuery } from 'react-query'
import { getPkeyPwd } from 'libs/account'
import { useSetRecoilState } from 'recoil'
import appStore from 'store/appStore'

const AuthMenuScreen = (): ReactElement => {
  const { navigation } = useAppNavigation()

  const { data: hasStoredKey = false } = useQuery(
    [KeyChainEnum.PK_PWD],
    async () => {
      const somePwd = await getPkeyPwd()
      return !!somePwd
    }
  )

  const setLoading = useSetRecoilState(appStore.loading)

  return (
    <AuthBody>
      <View style={{ rowGap: 10 }}>
        <FormButton
          disabled={!hasStoredKey}
          onPress={(): void => {
            navigation.replace(Routes.Login)
          }}>
          Sign In
        </FormButton>
        <Row style={{ columnGap: 10 }}>
          <FormButton
            containerStyle={{ backgroundColor: 'white', flex: 1 }}
            textStyle={{ color: COLOR.primary._400 }}
            onPress={(): void => {
              setLoading(true)
              setTimeout(async () => {
                navigation.replace(Routes.NewAccount)
              }, 500)
            }}>
            New Account
          </FormButton>
          <FormButton
            containerStyle={{ backgroundColor: 'white', flex: 1 }}
            textStyle={{ color: COLOR.primary._400 }}
            onPress={(): void => {
              navigation.replace(Routes.RecoverAccount)
            }}>
            Recover Account
          </FormButton>
        </Row>
        <TouchableOpacity style={styles.about} onPress={(): void => {}}>
          <Icon name="checkmark-circle" style={{ color: COLOR.primary._400 }} />
          <Text style={{ color: COLOR.primary._400 }}>About palm service</Text>
        </TouchableOpacity>
      </View>
    </AuthBody>
  )
}

export default AuthMenuScreen

const styles = StyleSheet.create({
  about: {
    justifyContent: 'center',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
})
