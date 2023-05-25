import useAuth from 'hooks/auth/useAuth'
import { useAppState } from 'hooks/useAppState'
import { getFsProfile } from 'libs/firebase'
import { recordError } from 'libs/logger'
import {
  backgroundMessageHandler,
  checkAppOpenedWithNotification,
  onForegroundAndroid,
  onForegroundIOS,
  onNotificationAndroid,
} from 'libs/notification'
import { useEffect, useState } from 'react'
import { Platform } from 'react-native'

import Notifee, { AuthorizationStatus } from '@notifee/react-native'
import firestore from '@react-native-firebase/firestore'
import messaging from '@react-native-firebase/messaging'
import { useSendbirdChat } from '@sendbird/uikit-react-native'
import { useAsyncEffect } from '@sendbird/uikit-utils'

const channelId: string = 'default'

/*
Note: A user can have up to 20 FCM registration tokens and 20 APNs device tokens each.
The oldest token will be deleted before a new token is added for a user who already has 20 device tokens registered.
Only the 20 newest tokens will be maintained for users who already have more than 20 of each token type.
*/
const useNotification = (): void => {
  const { sdk } = useSendbirdChat()
  const { user } = useAuth()

  const [notificationEnabled, setNotificationEnabled] = useState<boolean>(true)

  const { appVisibility } = useAppState()

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

  const registerDeviceToken = async (): Promise<void> => {
    if (!user?.auth?.profileId || !notificationEnabled) {
      return
    }

    const fsProfileField = await getFsProfile(user.auth.profileId)
    if (!fsProfileField) {
      return
    }

    try {
      const token =
        Platform.OS === 'ios'
          ? await messaging().getAPNSToken()
          : await messaging().getToken()

      if (token) {
        const registeredTokens =
          Platform.OS === 'ios'
            ? fsProfileField.deviceTokens?.apns ?? []
            : fsProfileField.deviceTokens?.fcm ?? []
        if (registeredTokens.includes(token)) {
          return
        }

        const tokens = [
          ...new Set(registeredTokens.concat(token).filter(x => !!x)),
        ].slice(-20)

        await Promise.all([
          Platform.OS === 'ios'
            ? sdk.registerAPNSPushTokenForCurrentUser(token)
            : sdk.registerFCMPushTokenForCurrentUser(token),
          firestore()
            .collection('profiles')
            .doc(user.auth.profileId)
            .update({
              deviceTokens: {
                ...fsProfileField?.deviceTokens,
                [Platform.OS === 'ios' ? 'apns' : 'fcm']: tokens,
              },
            }),
        ])
      }

      console.log('useNotification:registerDeviceToken', token)
    } catch (e) {
      recordError(e, 'useNotification:registerDeviceToken error')
    }
  }

  const unregisterDeviceToken = async (): Promise<void> => {
    if (!user?.auth?.profileId || !notificationEnabled) {
      return
    }

    const fsProfileField = await getFsProfile(user.auth.profileId)
    if (!fsProfileField) {
      return
    }

    try {
      const token =
        Platform.OS === 'ios'
          ? await messaging().getAPNSToken()
          : await messaging().getToken()

      if (token) {
        const registeredTokens =
          Platform.OS === 'ios'
            ? fsProfileField.deviceTokens?.apns ?? []
            : fsProfileField.deviceTokens?.fcm ?? []
        if (!registeredTokens.includes(token)) {
          return
        }

        const tokens = registeredTokens.filter(x => x !== token)

        await Promise.all([
          Platform.OS === 'ios'
            ? sdk.unregisterAPNSPushTokenForCurrentUser(token)
            : sdk.unregisterFCMPushTokenForCurrentUser(token),
          firestore()
            .collection('profiles')
            .doc(user.auth.profileId)
            .update({
              deviceTokens: {
                ...fsProfileField?.deviceTokens,
                [Platform.OS === 'ios' ? 'apns' : 'fcm']: tokens,
              },
            }),
        ])
      }

      console.log('useNotification:unregisterDeviceToken', token)
    } catch (e) {
      recordError(e, 'useNotification:unregisterDeviceToken error')
    }
  }

  useAsyncEffect(async () => {
    if (!user) {
      await unregisterDeviceToken()
    } else if (user?.auth?.profileId) {
      await registerDeviceToken()
    }
  }, [user?.auth?.profileId, notificationEnabled])

  useEffect(() => {
    Notifee.createChannel({
      id: channelId,
      name: 'Default Channel',
      importance: 4,
    })
    Notifee.onBackgroundEvent(onNotificationAndroid)

    messaging().setBackgroundMessageHandler(message =>
      backgroundMessageHandler(channelId, message)
    )

    const unsubscribes = [onForegroundAndroid(), onForegroundIOS()]
    return () => {
      unsubscribes.forEach(fn => fn())
    }
  }, [])

  useAsyncEffect(async () => {
    if (appVisibility !== 'foreground') {
      return
    }
    await checkAppOpenedWithNotification()
  }, [appVisibility])
}

export default useNotification
