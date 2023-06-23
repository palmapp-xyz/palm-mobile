import { Container, FormText, Header } from 'components'
import { COLOR } from 'consts'
import useAuth from 'hooks/auth/useAuth'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useVersions from 'hooks/useVersions'
import { Routes } from 'libs/navigation'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
      <FormText color={COLOR.black._900}>{name}</FormText>
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
      <FormText color={COLOR.black._900}>{name}</FormText>
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
      <FormText color={COLOR.black._900}>{name}</FormText>
      <FormText font={'SB'} color={COLOR.black._700}>
        {text}
      </FormText>
    </View>
  )
}

const SettingScreen = (): ReactElement => {
  const { logout } = useAuth()
  const { navigation } = useAppNavigation()
  const { t } = useTranslation()
  const version = useVersions()

  const [enablePush, setEnablePush] = useState<boolean>(false)

  return (
    <Container style={styles.container}>
      <Header
        title={t('Settings.HeaderTitle')}
        left="back"
        onPressLeft={navigation.goBack}
      />
      <View style={styles.body}>
        {/* <View style={styles.itemGroup}>
          <SettingSwitchItem
            name={t('Settings.PushNotification')}
            enable={enablePush}
            toggle={(value): void => {
              setEnablePush(value)
              // todo: save state
            }}
          />
        </View> */}
        <View style={styles.itemGroup}>
          <SettingItem
            name={t('Settings.ChangePin')}
            onPress={(): void => {}}
          />
          <SettingItem
            name={t('Settings.ExportWallet')}
            onPress={(): void => {
              navigation.navigate(Routes.ExportPrivate)
            }}
          />
        </View>
        <View style={[styles.itemGroup, { borderBottomWidth: 0 }]}>
          {/* <SettingItem name={t('Settings.Privacy')} onPress={(): void => {}} />
          <SettingItem name={t('Settings.Contact')} onPress={(): void => {}} />
          <SettingItem
            name={t('Settings.GiveUsFeedback')}
            onPress={(): void => {}}
          /> */}
          <SettingTextItem
            name={t('Settings.Version')}
            text={
              version.codepush
                ? `${version.app} (${version.codepush})`
                : `${version.app}`
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
            <FormText font={'SB'} color={COLOR.red}>
              {t('Settings.SignOut')}
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
  itemGroup: {
    backgroundColor: 'white',
    borderRadius: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.black._10,
  },
  item: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
