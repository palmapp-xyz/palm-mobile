import React, { ReactElement, useMemo } from 'react'
import { Alert, FlatList, StyleSheet, View } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import { generateMnemonic } from 'bip39'

import { COLOR } from 'consts'
import { Container, FormButton, Row, Header, FormText } from 'components'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'

const NewAccountScreen = (): ReactElement => {
  const mnemonic = useMemo(() => generateMnemonic(128), [])
  const { navigation } = useAppNavigation()

  const seedPhrase = mnemonic?.split(' ')

  return (
    <Container style={styles.container}>
      <Header left="back" onPressLeft={navigation.goBack} />

      <View style={styles.body}>
        <View style={{ rowGap: 8, paddingBottom: 40 }}>
          <FormText fontType="B.24" style={{ fontWeight: 'bold' }}>
            {'Copy your wallet’s\nseed phrase'}
          </FormText>
          <FormText color={COLOR.black._400} fontType="R.14">
            {
              'Keep the seed phrase in a safe place.\nIt will allow you to recover your wallet.'
            }
          </FormText>
        </View>
        <View
          style={{
            marginBottom: 12,
            backgroundColor: '#fffbf2',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 14,
          }}>
          <FormText fontType="R.12" color={COLOR.yellow}>
            Notice that your generated wallet's Privatekey is not stored on the
            server and is stored on your mobile device.
          </FormText>
        </View>
        <View style={{ paddingBottom: 12 }}>
          <FormButton
            figure="outline"
            onPress={(): void => {
              Alert.alert('Copied')
              Clipboard.setString(mnemonic!)
            }}>
            Copy the Set of Seed Phrase
          </FormButton>
        </View>
        <FlatList
          data={seedPhrase}
          numColumns={2}
          columnWrapperStyle={{ columnGap: 24 }}
          contentContainerStyle={{ rowGap: 12 }}
          keyExtractor={(item, index): string => `seedPhrase-${index}`}
          renderItem={({ item, index }): ReactElement => {
            return (
              <Row style={styles.seedItem}>
                <FormText style={{ width: 20 }}>{index + 1}</FormText>
                <View
                  style={{
                    flex: 1,
                    borderRadius: 14,
                    borderColor: COLOR.black._200,
                    borderWidth: 1,
                    borderStyle: 'solid',
                    paddingVertical: 4,
                    paddingHorizontal: 12,
                  }}>
                  <FormText fontType="R.14">{item}</FormText>
                </View>
              </Row>
            )
          }}
        />
      </View>

      <View style={styles.footer}>
        <FormButton
          size="lg"
          onPress={(): void => {
            navigation.navigate(Routes.ConfirmSeed, { mnemonic })
          }}>
          Next
        </FormButton>
      </View>
    </Container>
  )
}

export default NewAccountScreen

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
