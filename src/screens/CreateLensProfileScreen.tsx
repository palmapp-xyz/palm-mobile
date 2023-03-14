import React, { ReactElement, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { Container, FormButton } from 'components'
import useLens from 'hooks/lens/useLens'
import useAuth from 'hooks/independent/useAuth'
import useLensProfile from 'hooks/lens/useLensProfile'

const CreateLensProfileScreen = (): ReactElement => {
  const { user } = useAuth()
  const { createProfile } = useLens()
  const [isFetching, setIsFetching] = useState(false)

  const handle = `palm${user?.address.slice(-10).toLocaleLowerCase()}`

  const { refetch } = useLensProfile({
    userAddress: user?.address,
  })

  const onClickConfirm = async (): Promise<void> => {
    try {
      setIsFetching(true)
      await createProfile({
        handle,
      })
      await refetch()
    } catch (error) {
      console.log(
        'createProfile, onClickConfirm',
        JSON.stringify(error, null, 2)
      )
    }
  }

  return (
    <Container style={styles.container}>
      <View style={styles.body}>
        <View style={{ paddingTop: 30, alignItems: 'center' }}>
          <Text style={{ color: 'black', fontSize: 16, textAlign: 'center' }}>
            {"You don't have any lens Profile \n\nClick button to mint\n"}
          </Text>
          <Text style={{ fontWeight: 'bold' }}>Handle : {handle}</Text>
        </View>
        <FormButton disabled={isFetching} onPress={onClickConfirm}>
          Mint Profile NFT
        </FormButton>
      </View>
    </Container>
  )
}

export default CreateLensProfileScreen

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { flex: 1, padding: 10, justifyContent: 'space-between' },
})
