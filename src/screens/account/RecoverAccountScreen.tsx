import React, { ReactElement } from 'react'
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useRecoilState } from 'recoil'
import Icon from 'react-native-vector-icons/Ionicons'
import Clipboard from '@react-native-clipboard/clipboard'
import { FlatList } from 'react-native'

import { COLOR } from 'consts'

import {
  Container,
  ErrorMessage,
  FormButton,
  Row,
  FormInput,
  FormText,
  Header,
  MenuItem,
  KeyboardAvoidingView,
} from 'components'
import useRecoverAccount from 'hooks/page/account/useRecoverAccount'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import appStore from 'store/appStore'
import Loading from 'components/atoms/Loading'
import { AuthChallengeInfo } from 'types'

const RecoverAccountScreen = (): ReactElement => {
  const {
    usePkey,
    setUsePkey,
    privateKey,
    setPrivateKey,
    seedPhrase,
    updateSeedPhrase,
    mnemonicErrMsg,
    isValidForm,
    onClickConfirm,
  } = useRecoverAccount()
  const { navigation, params } = useAppNavigation<Routes.RecoverAccount>()
  const isSignUp = params.isSignUp

  const [loading] = useRecoilState(appStore.loading)
  if (loading) {
    return <Loading />
  }

  const onPressConfirm = async (): Promise<void> => {
    await onClickConfirm(
      (challenge: AuthChallengeInfo | undefined, errMsg?: string) => {
        if (challenge) {
          navigation.replace(Routes.Sign4Auth, { challenge })
        } else {
          Alert.alert('Unknown Error', errMsg)
        }
      }
    )
  }

  return (
    <Container style={styles.container}>
      <Header left="back" onPressLeft={navigation.goBack} />
      <View style={styles.body}>
        <View style={{ rowGap: 8 }}>
          <FormText fontType="B.24" style={{ fontWeight: 'bold' }}>
            {isSignUp
              ? 'How do you\nimport your wallet?'
              : 'Please verify\nthe wallet'}
          </FormText>
          {isSignUp === false && (
            <FormText color={COLOR.black._400} fontType="R.14">
              {'The account can only be restored\nby verifying the wallet.'}
            </FormText>
          )}
        </View>
        <Row
          style={{
            columnGap: 8,
            paddingTop: 40,
            paddingBottom: 28,
            justifyContent: 'center',
          }}>
          <MenuItem
            value={true}
            title="Enter a private key"
            selected={usePkey}
            setSelected={setUsePkey}
          />
          <MenuItem
            value={false}
            title="Seed Phrase"
            selected={!usePkey}
            setSelected={setUsePkey}
          />
        </Row>
        {usePkey ? (
          <View style={{ rowGap: 12 }}>
            <FormInput
              placeholder="Private key"
              value={privateKey}
              onChangeText={setPrivateKey}
            />
            <TouchableOpacity
              onPress={(): void => {
                Clipboard.getString().then(text => {
                  setPrivateKey(text)
                })
              }}>
              <Row style={{ alignItems: 'center', alignSelf: 'center' }}>
                <Icon name="copy-outline" size={14} />
                <FormText fontType="R.12">Paste from Clipboard</FormText>
              </Row>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <FlatList
              data={Array.from({ length: 12 })}
              numColumns={2}
              columnWrapperStyle={{ columnGap: 24 }}
              contentContainerStyle={{ rowGap: 12 }}
              keyExtractor={(item, index): string => `seedPhrase-${index}`}
              renderItem={({ index }): ReactElement => {
                const value = seedPhrase[index]

                return (
                  <Row style={styles.seedItem}>
                    <FormText style={{ width: 20 }}>{index + 1}</FormText>
                    <View style={{ flex: 1 }}>
                      <FormInput
                        value={value}
                        onChangeText={(newValue: string): void =>
                          updateSeedPhrase({ value: newValue, index })
                        }
                      />
                    </View>
                  </Row>
                )
              }}
            />
            <ErrorMessage message={mnemonicErrMsg} />
          </>
        )}
      </View>

      <KeyboardAvoidingView>
        <View style={styles.footer}>
          <FormButton
            size="lg"
            disabled={!isValidForm || loading}
            onPress={onPressConfirm}>
            {isSignUp ? 'Import the Wallet' : 'Verify'}
          </FormButton>
        </View>
      </KeyboardAvoidingView>
    </Container>
  )
}

export default RecoverAccountScreen

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { flex: 1, paddingHorizontal: 20, paddingVertical: 12 },
  footer: {
    borderTopWidth: 1,
    borderTopColor: `${COLOR.black._900}${COLOR.opacity._10}`,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  seedItem: {
    flex: 1,
    columnGap: 4,
    alignItems: 'center',
  },
})
