import React, { ReactElement, useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import { COLOR } from 'consts'

import { Container, FormButton, FormInput, Header } from 'components'
import { ContractAddr } from 'types'
import { Routes } from 'libs/navigation'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useFsChannel from 'hooks/firestore/useFsChannel'
import { utils } from 'ethers'

const ChannelTokenGatingScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.ChannelTokenGating>()

  const [editGatingToken, setEditGatingToken] = useState('' as ContractAddr)
  const editGatingTokenErrMsg = useMemo(() => {
    if (editGatingToken) {
      if (utils.isAddress(editGatingToken) === false) {
        return 'Invalid address'
      }
    }
    return ''
  }, [editGatingToken])

  const { fsChannelField, updateGatingToken, isFetching } = useFsChannel({
    channelUrl: params.channelUrl,
  })

  return (
    <Container style={styles.container}>
      <Header
        title="Token Gating"
        left={
          <Icon name="ios-chevron-back" color={COLOR.gray._800} size={20} />
        }
        onPressLeft={navigation.goBack}
      />
      <View style={styles.body}>
        <View>
          <View
            style={{ borderBottomWidth: 1, paddingBottom: 5, marginBottom: 5 }}>
            <Text>Token : {fsChannelField?.gatingToken || '-'}</Text>
          </View>
          <Text>Update</Text>
          <FormInput
            value={editGatingToken}
            onChangeText={(value): void => {
              setEditGatingToken(value as ContractAddr)
            }}
          />
          {editGatingTokenErrMsg && (
            <Text style={{ color: COLOR.error }}>{editGatingTokenErrMsg}</Text>
          )}
        </View>
        <FormButton
          disabled={isFetching}
          onPress={(): void => {
            updateGatingToken(editGatingToken)
          }}>
          Confirm
        </FormButton>
      </View>
    </Container>
  )
}

export default ChannelTokenGatingScreen

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { flex: 1, padding: 10, justifyContent: 'space-between' },
})
