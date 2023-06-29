import { generateMnemonic } from 'bip39'
import { Container, FormButton, FormText, Header, Row } from 'components'
import { COLOR } from 'core/consts'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useToast from 'hooks/useToast'
import { Routes } from 'libs/navigation'
import React, { ReactElement, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, View } from 'react-native'

import Clipboard from '@react-native-clipboard/clipboard'

const NewAccountScreen = (): ReactElement => {
  const mnemonic = useMemo(() => generateMnemonic(128), [])
  const { navigation } = useAppNavigation()
  const toast = useToast()
  const { t } = useTranslation()

  const [isSeedCopied, setIsSeedCopied] = useState(false)

  const seedPhrase = mnemonic?.split(' ')

  return (
    <Container style={styles.container}>
      <Header left="back" onPressLeft={navigation.goBack} />

      <View style={styles.body}>
        <View style={{ rowGap: 8, paddingBottom: 40 }}>
          <FormText font={'B'} size={24} style={{ fontWeight: 'bold' }}>
            {t('Auth.CopySeedPhrase')}
          </FormText>
          <FormText color={COLOR.black._400}>
            {t('Auth.CopySeedPhraseMessage')}
          </FormText>
        </View>
        <View
          style={{
            marginBottom: 12,
            backgroundColor: '#fffbf2',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 14,
          }}
        >
          <FormText color={COLOR.yellow}>
            {t('Auth.CopySeedPhraseNotice')}
          </FormText>
        </View>
        <View style={{ paddingBottom: 12 }}>
          <FormButton
            figure="outline"
            onPress={(): void => {
              toast.show(t('Auth.CopySeedCopiedSeedToast'), {
                color: 'green',
                icon: 'check',
              })
              Clipboard.setString(mnemonic!)
              setIsSeedCopied(true)
            }}
          >
            {t('Auth.CopySeed')}
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
                  }}
                >
                  <FormText>{item}</FormText>
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
            if (isSeedCopied) {
              navigation.navigate(Routes.ConfirmSeed, { mnemonic })
            } else {
              toast.show(t('Auth.CopySeedErrorToast'), {
                color: 'red',
                icon: 'info',
              })
            }
          }}
        >
          {t('Common.Next')}
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
