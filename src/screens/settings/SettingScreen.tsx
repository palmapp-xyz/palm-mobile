import { Container, Header } from 'components'
import { COLOR } from 'consts'
import useAuth from 'hooks/auth/useAuth'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import React, { ReactElement } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

const SettingScreen = (): ReactElement => {
  const { logout } = useAuth()
  const { navigation } = useAppNavigation()

  return (
    <Container style={styles.container}>
      <Header title="Setting" left="back" onPressLeft={navigation.goBack} />
      <View style={styles.body}>
        <View style={styles.itemGroup}>
          <TouchableOpacity
            style={styles.item}
            onPress={(): void => {
              navigation.navigate(Routes.ExportPrivate)
            }}
          >
            <Text>Export key</Text>
            <Icon
              name="ios-chevron-forward"
              color={COLOR.black._800}
              size={20}
            />
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.item}
            onPress={(): void => {
              console.log('bio auth')
            }}
          >
            <Text>Face ID / Touch ID</Text>
            <Row>
              <Switch />
            </Row>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={(): void => {
              console.log('Push Notifications')
            }}
          >
            <Text>Push Notifications</Text>
            <Row>
              <Switch />
            </Row>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={(): void => {
              console.log('Service Agreement')
            }}
          >
            <Text>Service Agreement</Text>
            <Icon
              name="ios-chevron-forward"
              color={COLOR.black._800}
              size={20}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={(): void => {
              console.log('Privacy')
            }}
          >
            <Text>Privacy</Text>
            <Icon
              name="ios-chevron-forward"
              color={COLOR.black._800}
              size={20}
            />
          </TouchableOpacity> */}
          <View style={styles.item}>
            <Text>Version</Text>
            <Text style={{ color: COLOR.primary._400 }}>0.0.2</Text>
          </View>
          {/* <TouchableOpacity
            style={styles.item}
            onPress={(): void => {
              console.log('Version')
            }}
          >
            <Text>Contact</Text>
            <Icon
              name="ios-chevron-forward"
              color={COLOR.black._800}
              size={20}
            />
          </TouchableOpacity> */}
        </View>
        <View style={styles.itemGroup}>
          <TouchableOpacity
            style={[styles.item, { justifyContent: 'center' }]}
            onPress={logout}
          >
            <Text style={{ color: COLOR.error }}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  )
}

export default SettingScreen

const styles = StyleSheet.create({
  container: {},
  body: { padding: 10, rowGap: 20 },
  itemGroup: { backgroundColor: 'white', borderRadius: 15 },
  item: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
