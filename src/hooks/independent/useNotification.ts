import useAuth from 'hooks/auth/useAuth'
import {
  backgroundMessageHandler,
  onForegroundAndroid,
  onForegroundIOS,
  onRemoteNotification,
} from 'libs/notification'
import { useEffect, useState } from 'react'

import Notifee, { AuthorizationStatus } from '@notifee/react-native'
import messaging from '@react-native-firebase/messaging'
import { useAsyncEffect } from '@sendbird/uikit-utils'
import useNotificationConf from './useNotificationConf'
import useNotificationRegister from './useNotificationRegister'

const channelId: string = 'default'
/*
Note: A user can have up to 20 FCM registration tokens and 20 APNs device tokens each.
The oldest token will be deleted before a new token is added for a user who already has 20 device tokens registered.
Only the 20 newest tokens will be maintained for users who already have more than 20 of each token type.
*/
const useNotification = (): void => {
  const { user } = useAuth()

  const [notificationEnabled, setNotificationEnabled] = useState<boolean>(true)

  const { registerDeviceToken, unregisterDeviceToken } =
    useNotificationRegister()

  const { isEnableNotification } = useNotificationConf()

  useAsyncEffect(async () => {
    /*
      If the user declines permission, they must manually allow notifications
      via the Settings UI for the application.
    */
    const authorizationStatus = await messaging().requestPermission({
      providesAppNotificationSettings: true,
    })
    setNotificationEnabled(
      authorizationStatus === AuthorizationStatus.AUTHORIZED ||
        authorizationStatus === AuthorizationStatus.PROVISIONAL
    )
  }, [])

  useAsyncEffect(async () => {
    const pushEnable = await isEnableNotification()

    if (user?.auth?.profileId && pushEnable) {
      await registerDeviceToken()
    } else if (!user) {
      await unregisterDeviceToken()
    }
  }, [user?.auth?.profileId, notificationEnabled])

  useEffect(() => {
    Notifee.createChannel({
      id: channelId,
      name: 'Default Channel',
      importance: 4,
    })
    Notifee.onBackgroundEvent(onRemoteNotification)

    messaging().setBackgroundMessageHandler(message =>
      backgroundMessageHandler(channelId, message)
    )

    const unsubscribes = [onForegroundAndroid(), onForegroundIOS()]
    return () => {
      unsubscribes.forEach(fn => fn())
    }
  }, [])
}

export default useNotification
