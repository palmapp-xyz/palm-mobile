import { COLOR } from 'palm-core/consts'
import { Routes } from 'palm-core/libs/navigation'
import {
  Container,
  FormButton,
  Header,
} from 'palm-react-native-ui-kit/components'
import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import useSign4Auth from 'palm-react/hooks/page/sign/useSign4Auth'
import fetchApiStore from 'palm-react/store/fetchApiStore'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import RenderHtml from 'react-native-render-html'
import { useRecoilValue } from 'recoil'

const Sign4AuthScreen = (): ReactElement => {
  const { navigation } = useAppNavigation<Routes.Sign4Auth>()
  const { challenge, signChallenge } = useSign4Auth()
  const isFetching = useRecoilValue(fetchApiStore.isFetchingPostApiStore)
  const { width } = useWindowDimensions()
  const { t } = useTranslation()

  const source = {
    html: `<p>${JSON.stringify(challenge?.message)
      ?.replace(/"/g, '')
      ?.replace(/\\n/g, '<br/>')}</p>`,
  }

  return (
    <Container style={styles.container}>
      <Header
        left="back"
        onPressLeft={navigation.goBack}
        title={t('Auth.Sign4AuthHeaderTitle')}
      />

      <View style={{ flex: 1, padding: 20 }}>
        <View style={styles.signMessageBox}>
          {challenge ? (
            <RenderHtml source={source} contentWidth={width} />
          ) : (
            <Text>{t('Auth.Sign4AuthLoading')}</Text>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <FormButton disabled={!challenge || isFetching} onPress={signChallenge}>
          {t('Auth.Sign4AuthLogin')}
        </FormButton>
      </View>
    </Container>
  )
}

export default Sign4AuthScreen

const styles = StyleSheet.create({
  container: { flex: 1 },
  signMessageBox: {
    padding: 10,
    backgroundColor: '#cecece',
    borderRadius: 20,
  },
  tabItem: { padding: 10, borderRadius: 10 },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLOR.black._90010,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  btn: { borderRadius: 0 },
})
