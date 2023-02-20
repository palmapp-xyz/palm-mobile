import React, { ReactElement } from 'react'
import { StyleSheet, Text } from 'react-native'

import { Container, FormButton } from 'components'
import useAuth from 'hooks/independent/useAuth'

const SettingScreen = (): ReactElement => {
  const { logout } = useAuth()

  return (
    <Container style={styles.container}>
      <Text>Setting</Text>
      <FormButton onPress={logout}>Logout</FormButton>
    </Container>
  )
}

export default SettingScreen

const styles = StyleSheet.create({
  container: {},
})
