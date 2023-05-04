import React, { ReactElement, useEffect, useState } from 'react'
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native'

import Clipboard from '@react-native-clipboard/clipboard'
import { Container, FormText, Header } from 'components'
import { COLOR } from 'consts'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { getMnemonic, getPkey } from 'libs/account'
import { Routes } from 'libs/navigation'
import Icon from 'react-native-vector-icons/Ionicons'

const ExportPrivateScreen = (): ReactElement => {
  const { navigation } = useAppNavigation<Routes.ExportPrivate>()
  const [privateKey, setPrivateKey] = useState('')
  const [mnemonic, setMnemonic] = useState('')
  const [hideKey, setHideKey] = useState(true)

  const displayKey = mnemonic || privateKey

  useEffect(() => {
    getPkey().then(key => setPrivateKey(key))
    getMnemonic().then(m => setMnemonic(m))
  }, [])

  return (
    <Container style={styles.container}>
      <Header
        title="Export private"
        left="back"
        onPressLeft={navigation.goBack}
      />
      <View style={styles.body}>
        <View style={{ position: 'relative' }}>
          <View style={styles.keyBox}>
            <FormText>{displayKey}</FormText>
          </View>
          {hideKey && (
            <TouchableOpacity
              style={styles.curtain}
              onPress={(): void => {
                setHideKey(false)
              }}
            >
              <Icon name="eye-off-outline" size={24} />
              <FormText fontType="R.14"> Show the key</FormText>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}
          onPress={(): void => {
            Alert.alert('Copied')
            Clipboard.setString(displayKey)
          }}
        >
          <Icon name="copy-outline" size={14} />
          <FormText fontType="R.14"> Copy to Clipboard</FormText>
        </TouchableOpacity>
      </View>
    </Container>
  )
}

export default ExportPrivateScreen

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { padding: 20, gap: 8 },
  keyBox: {
    padding: 10,
    borderRadius: 14,
    backgroundColor: COLOR.black._100,
  },
  curtain: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: COLOR.black._200,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
})
