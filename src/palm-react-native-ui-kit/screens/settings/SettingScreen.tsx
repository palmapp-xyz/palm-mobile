import { COLOR } from 'palm-core/consts'
import {
  PALM_PRIVACY_POLICY_URL,
  PALM_TERMS_OF_SERVICE_URL,
} from 'palm-core/consts/url'
import { Routes } from 'palm-core/libs/navigation'
import {
  Container,
  FormModal,
  FormText,
  Header,
} from 'palm-react-native-ui-kit/components'
import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import useToast from 'palm-react-native/app/useToast'
import useVersions from 'palm-react-native/app/useVersions'
import useAuth from 'palm-react/hooks/auth/useAuth'
import useNotificationConf from 'palm-react/hooks/notification/useNotificationConf'
import useNotificationRegister from 'palm-react/hooks/notification/useNotificationRegister'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Linking,
  Platform,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native'
import RNRestart from 'react-native-restart'
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
  value: boolean
  toggle?: (value: boolean) => void
}): ReactElement => {
  const { name, value, toggle } = props
  return (
    <View style={styles.item}>
      <FormText color={COLOR.black._900}>{name}</FormText>
      <Switch
        style={Platform.select({
          ios: {
            transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
          },
        })}
        value={value}
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
      <FormText font={'B'} color={COLOR.primary._400}>
        {text}
      </FormText>
    </View>
  )
}

const SettingScreen = (): ReactElement => {
  const { logout } = useAuth()
  const { navigation } = useAppNavigation()
  const { t } = useTranslation()
  const toast = useToast()
  const version = useVersions()

  const [enablePush, setEnablePush] = useState<boolean>(false)
  const [disablePushSwitch, setDisablePushSwitch] = useState<boolean>(false)
  const [visibleSignOutModal, setVisibleSignOutModal] = useState<boolean>(false)

  const { registerDeviceToken, unregisterDeviceToken } =
    useNotificationRegister()
  const {
    isNotificationEnabled,
    setEnableNotification,
    checkNotificationPermission,
  } = useNotificationConf()

  useEffect(() => {
    const init = async (): Promise<void> => {
      const isPermissionAuthorized = await checkNotificationPermission(false)
      if (!isPermissionAuthorized) {
        setEnablePush(false)
        return
      }

      const enable = await isNotificationEnabled()
      setEnablePush(enable)
    }
    init()
  }, [])

  const handlePushNotification = async (enable: boolean): Promise<void> => {
    // check permission
    const isPermissionAuthorized = await checkNotificationPermission(true)
    if (!isPermissionAuthorized) {
      return
    }

    // register, unregister
    try {
      setDisablePushSwitch(true)
      setEnablePush(enable)

      enable ? await registerDeviceToken() : await unregisterDeviceToken()

      setEnableNotification(enable)
    } catch (e) {
      const message = JSON.stringify(e)
      toast.show(message, { color: 'red', icon: 'info' })
    } finally {
      // Toggle again after 1.5 seconds, to prevent frequent requests
      setTimeout(() => {
        setDisablePushSwitch(false)
      }, 1500)
    }
  }

  const setNewPin = async (result: boolean): Promise<void> => {
    if (result) {
      navigation.pop()
    } else {
      toast.show(t('Pin.PinMismatchToast'), { color: 'red', icon: 'check' })
    }
  }
  const changePin = async (result: boolean): Promise<void> => {
    if (result) {
      navigation.replace(Routes.Pin, {
        type: 'set',
        result: setNewPin,
        cancel: () => {
          navigation.pop()
        },
      })
    } else {
      toast.show(t('Pin.PinMismatchToast'), { color: 'red', icon: 'check' })
    }
  }

  return (
    <Container
      style={[styles.container]}
      safeAreaBackgroundColor={COLOR.black._90005}
    >
      <View style={styles.body}>
        <Header
          left="back"
          onPressLeft={navigation.goBack}
          containerStyle={{ backgroundColor: 'transparent' }}
        />
        <View style={styles.itemGroup}>
          <SettingSwitchItem
            name={t('Settings.PushNotification')}
            value={enablePush}
            toggle={(value): void => {
              !disablePushSwitch && handlePushNotification(value)
            }}
          />
        </View>
        <View style={styles.itemGroup}>
          <SettingItem
            name={t('Settings.ChangePin')}
            onPress={(): void => {
              navigation.navigate(Routes.Pin, {
                type: 'auth',
                result: changePin,
                cancel: () => {
                  navigation.pop()
                },
              })
            }}
          />
          <SettingItem
            name={t('Settings.ExportWallet')}
            onPress={(): void => {
              navigation.navigate(Routes.Pin, {
                type: 'auth',
                result: async (result: boolean): Promise<void> => {
                  if (result) {
                    navigation.replace(Routes.ExportWallet)
                  } else {
                    toast.show(t('Pin.PinMismatchToast'), {
                      color: 'red',
                      icon: 'info',
                    })
                  }
                },
                cancel: () => {
                  navigation.pop()
                },
              })
            }}
          />
        </View>
        <View style={styles.itemGroup}>
          <SettingItem
            name={t('Settings.ServiceAgreement')}
            onPress={(): void => {
              Linking.openURL(PALM_TERMS_OF_SERVICE_URL)
            }}
          />
          <SettingItem
            name={t('Settings.Privacy')}
            onPress={(): void => {
              Linking.openURL(PALM_PRIVACY_POLICY_URL)
            }}
          />
          {/*<SettingItem
            name={t('Settings.Contact')}
            onPress={(): void => {
              Linking.openURL(URL_CONTACT)
            }}
          />
          <SettingItem
            name={t('Settings.GiveUsFeedback')}
            onPress={(): void => {
              Linking.openURL(URL_GIVE_US_FEEDBACK)
            }}
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
            style={styles.button}
            onPress={(): void => {
              setVisibleSignOutModal(true)
            }}
          >
            <FormText font={'SB'} color={COLOR.black._300}>
              {t('Settings.SignOut')}
            </FormText>
          </TouchableOpacity>
        </View>
      </View>
      <FormModal
        visible={visibleSignOutModal}
        title={t('Components.Modal.SignOut.Title')}
        message={t('Components.Modal.SignOut.Message')}
        positive={{
          text: t('Components.Modal.SignOut.Positive'),
          callback: (): void => {
            setVisibleSignOutModal(false)
          },
        }}
        negative={{
          text: t('Components.Modal.SignOut.Negative'),
          callback: (): void => {
            logout(() => RNRestart.restart())
          },
        }}
      />
    </Container>
  )
}

export default SettingScreen

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: {
    flex: 1,
    rowGap: 12,
  },
  itemGroup: { backgroundColor: 'white' },
  item: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: COLOR.white,
    borderColor: COLOR.black._100,
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
})
