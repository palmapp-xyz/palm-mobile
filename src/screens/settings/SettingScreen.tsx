import { Container, FormText, Header } from 'components'
import { COLOR } from 'consts'
import useAuth from 'hooks/auth/useAuth'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useVersions from 'hooks/useVersions'
import { Routes } from 'libs/navigation'
import React, { ReactElement, useState } from 'react'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Switch } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'

const SettingItem = (props: {
  name: string
  onPress?: () => void
}): ReactElement => {
  const { name, onPress } = props

  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <FormText fontType="R.14" color={COLOR.black._900}>
        {name}
      </FormText>
      <Icon name="ios-chevron-forward" color={COLOR.black._300} size={20} />
    </TouchableOpacity>
  )
}

const SettingSwitchItem = (props: {
  name: string
  enable: boolean
  toggle?: (value: boolean) => void
}): ReactElement => {
  const { name, enable, toggle } = props
  return (
    <View style={styles.item}>
      <FormText fontType="R.14" color={COLOR.black._900}>
        {name}
      </FormText>
      <Switch
        style={Platform.select({
          ios: {
            transform: [{ scaleX: 0.6 }, { scaleY: 0.6 }],
          },
        })}
        value={enable}
        onValueChange={toggle}
      />
    </View>
  )
}

const SettingTextItem = (props: {
  name: string
  text?: string
}): ReactElement => {
  const { name, text } = props
  return (
    <View style={styles.item}>
      <FormText fontType="R.14" color={COLOR.black._900}>
        {name}
      </FormText>
      <FormText fontType="B.14" color={COLOR.primary._400}>
        {text}
      </FormText>
    </View>
  )
}

const SettingScreen = (): ReactElement => {
  const { logout } = useAuth()
  const { navigation } = useAppNavigation()
  const version = useVersions()

  const [enablePush, setEnablePush] = useState<boolean>(false)

  return (
    <Container style={styles.container}>
      <Header title="Setting" left="back" onPressLeft={navigation.goBack} />
      <View style={styles.body}>
        <View style={styles.itemGroup}>
          <SettingSwitchItem
            name="Push Notifications"
            enable={enablePush}
            toggle={(value): void => {
              setEnablePush(value)
              // todo: save state
            }}
          />
        </View>
        <View style={styles.itemGroup}>
          <SettingItem name="Change PIN code" onPress={(): void => {}} />
          <SettingItem
            name="Export Wallet"
            onPress={(): void => {
              navigation.navigate(Routes.ExportPrivate)
            }}
          />
        </View>
        <View style={styles.itemGroup}>
          <SettingItem name="Service agreement" onPress={(): void => {}} />
          <SettingItem name="Privacy" onPress={(): void => {}} />
          <SettingItem name="Contact" onPress={(): void => {}} />
          <SettingItem name="Give us Feedback! 🙌" onPress={(): void => {}} />
          <SettingTextItem
            name="Version"
            text={
              version.codepush
                ? `${version.app}-${version.codepush} ${
                    __DEV__ ? '(dev)' : '(release)'
                  }`
                : `${version.app} ${__DEV__ ? '(dev)' : '(release)'}`
            }
          />
        </View>
        <View style={(styles.itemGroup, { alignSelf: 'center' })}>
          <TouchableOpacity
            style={[
              styles.item,
              {
                borderColor: COLOR.black._100,
                borderWidth: 1,
                borderRadius: 9,
                paddingHorizontal: 12,
                paddingVertical: 6,
                alignSelf: 'flex-start',
              },
            ]}
            onPress={(): void => {
              // warning?
              logout()
            }}
          >
            <FormText fontType="SB.12" color={COLOR.red}>
              Sign Out
            </FormText>
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
    alignItems: 'center',
  },
})
