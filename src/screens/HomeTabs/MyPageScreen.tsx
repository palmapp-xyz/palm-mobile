import React, { ReactElement } from 'react'
import { StyleSheet, Text, Pressable } from 'react-native'
import { Icon } from '@sendbird/uikit-react-native-foundation'

import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import { Container, Row } from 'components'

const MyPageScreen = (): ReactElement => {
  const { navigation } = useAppNavigation()
  return (
    <Container style={styles.container}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 20 }}>MyPageScreen</Text>
        <Pressable
          style={styles.settingIcon}
          onPress={(): void => {
            navigation.navigate(Routes.Setting)
          }}>
          <Icon icon={'settings-filled'} color={'black'} />
        </Pressable>
      </Row>
    </Container>
  )
}

export default MyPageScreen

const styles = StyleSheet.create({
  container: {},
  settingIcon: {},
})
