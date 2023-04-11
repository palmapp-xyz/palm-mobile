import React, { ReactElement } from 'react'
import { StyleSheet, View, Text, Alert } from 'react-native'
import RenderHtml from 'react-native-render-html'

import { AuthBody, FormButton, Row } from 'components'
import useSign4Auth from 'hooks/page/sign/useSign4Auth'
import { useRecoilValue } from 'recoil'
import fetchApiStore from 'store/fetchApiStore'
import { SupportedNetworkEnum } from 'types'
import { COLOR } from 'consts'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'

const Sign4AuthScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.Sign4Auth>()
  const { challenge } = params
  const { signChallenge } = useSign4Auth(SupportedNetworkEnum.ETHEREUM)
  const isFetching = useRecoilValue(fetchApiStore.isFetchingPostApiStore)

  const source = {
    html: `<p>${challenge?.message}</p>`,
  }

  const onPressSign = async (): Promise<void> => {
    await signChallenge(challenge, (errMsg: string) => {
      Alert.alert('Unknown Error', errMsg)
    })
  }

  return (
    <AuthBody>
      <View style={{ gap: 10 }}>
        <Text style={{ fontWeight: 'bold' }}>Authenticate</Text>
        <View style={styles.signMessageBox}>
          {challenge ? (
            <RenderHtml source={source} />
          ) : (
            <Text>Loading Challenge...</Text>
          )}
        </View>
      </View>

      <Row style={styles.btnGroup}>
        <FormButton
          containerStyle={[styles.btn, { backgroundColor: 'white' }]}
          textStyle={{
            color: COLOR.primary._400,
            fontWeight: '400',
            paddingHorizontal: 20,
          }}
          onPress={(): void => {
            navigation.replace(Routes.AuthMenu)
          }}>
          Cancel
        </FormButton>

        <FormButton
          containerStyle={[styles.btn, { flex: 1 }]}
          disabled={!challenge || isFetching}
          onPress={onPressSign}>
          Sign to Login
        </FormButton>
      </Row>
    </AuthBody>
  )
}

export default Sign4AuthScreen

const styles = StyleSheet.create({
  signMessageBox: {
    padding: 10,
    backgroundColor: '#cecece',
    borderRadius: 20,
  },
  tabItem: { padding: 10, borderRadius: 10 },
  btnGroup: { marginHorizontal: -20, paddingTop: 20, marginBottom: -30 },
  btn: { borderRadius: 0 },
})
