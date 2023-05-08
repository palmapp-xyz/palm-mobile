import {
  Container,
  ErrorMessage,
  FormButton,
  FormInput,
  FormText,
  Header,
  MenuItem,
  Row,
} from 'components'
import Loading from 'components/atoms/Loading'
import { COLOR } from 'consts'
import useRecoverAccount from 'hooks/page/account/useRecoverAccount'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import React, { ReactElement } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useRecoilState } from 'recoil'
import appStore from 'store/appStore'

import Clipboard from '@react-native-clipboard/clipboard'

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

  const [loading, setLoading] = useRecoilState(appStore.loading)

  const onPressConfirm = async (): Promise<void> => {
    setLoading(true)
    setTimeout(async () => {
      await onClickConfirm()
      setLoading(false)
      navigation.replace(Routes.Sign4Auth)
    }, 100)
  }

  if (loading) {
    return <Loading />
  }

  return (
    <Container style={styles.container} keyboardAvoiding={true}>
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
          }}
        >
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
              }}
            >
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

      <View style={styles.footer}>
        <FormButton
          size="lg"
          disabled={!isValidForm || loading}
          onPress={onPressConfirm}
        >
          {isSignUp ? 'Import the Wallet' : 'Verify'}
        </FormButton>
      </View>
    </Container>
  )
}

export default RecoverAccountScreen

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { flex: 1, paddingHorizontal: 20, paddingVertical: 12 },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLOR.black._90010,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  seedItem: {
    flex: 1,
    columnGap: 4,
    alignItems: 'center',
  },
})
