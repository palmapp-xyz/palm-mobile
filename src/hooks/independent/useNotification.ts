import Notifee, { AuthorizationStatus } from '@notifee/react-native'
import messaging from '@react-native-firebase/messaging'
import { Platform } from 'react-native'

import { useAsyncEffect } from '@sendbird/uikit-utils'
import { useSendbirdChat } from '@sendbird/uikit-react-native'

import {
  backgroundMessageHandler,
  onForegroundAndroid,
  onForegroundIOS,
  onNotificationAndroid,
} from 'libs/notification'
import { useEffect, useState } from 'react'
import useFsProfile from 'hooks/firestore/useFsProfile'
import { recordError } from 'libs/logger'

export type UseNotificationReturn = {
  channelId: string
  notificationEnabled: boolean
  unregisterDeviceToken: () => Promise<void>
}

/*
Note: A user can have up to 20 FCM registration tokens and 20 APNs device tokens each.
The oldest token will be deleted before a new token is added for a user who already has 20 device tokens registered.
Only the 20 newest tokens will be maintained for users who already have more than 20 of each token type.
*/
const useNotification = ({
  profileId,
  channelId,
}: {
  profileId: string | undefined
  channelId: string
}): UseNotificationReturn => {
  const { sdk } = useSendbirdChat()
  const { fsProfile, fsProfileField } = useFsProfile({
    profileId,
  })
  const [notificationEnabled, setNotificationEnabled] = useState<boolean>(true)

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
    if (!fsProfileField || !notificationEnabled) {
      return
    }

    try {
      const token =
        Platform.OS === 'ios'
          ? await messaging().getAPNSToken()
          : await messaging().getToken()

      if (token) {
        const tokens = [
          ...new Set(
            (
              fsProfileField.deviceTokens?.[
                Platform.OS === 'ios' ? 'apns' : 'fcm'
              ] ?? []
            )
              .concat(token)
              .filter(x => !!x)
          ),
        ].slice(-20)

        await Promise.all([
          Platform.OS === 'ios'
            ? sdk.registerAPNSPushTokenForCurrentUser(token)
            : sdk.registerFCMPushTokenForCurrentUser(token),
          fsProfile!.update({
            deviceTokens: {
              ...fsProfileField?.deviceTokens,
              [Platform.OS === 'ios' ? 'apns' : 'fcm']: tokens,
            },
          }),
        ])
      }
    } catch (e) {
      recordError(e, 'useNotification:registerDeviceToken error')
    }
  }

  const unregisterDeviceToken = async (): Promise<void> => {
    if (!fsProfileField || !notificationEnabled) {
      return
    }

    try {
      const token =
        Platform.OS === 'ios'
          ? await messaging().getAPNSToken()
          : await messaging().getToken()

      if (token) {
        const tokens = (
          fsProfileField.deviceTokens?.[
            Platform.OS === 'ios' ? 'apns' : 'fcm'
          ] ?? []
        ).filter(x => x !== token)

        await Promise.all([
          Platform.OS === 'ios'
            ? sdk.unregisterAPNSPushTokenForCurrentUser(token)
            : sdk.unregisterFCMPushTokenForCurrentUser(token),
          fsProfile!.update({
            deviceTokens: {
              ...fsProfileField?.deviceTokens,
              [Platform.OS === 'ios' ? 'apns' : 'fcm']: tokens,
            },
          }),
        ])
      }
    } catch (e) {
      recordError(e, 'useNotification:unregisterDeviceToken error')
    }
  }

  useAsyncEffect(async () => {
    if (fsProfileField && notificationEnabled) {
      await registerDeviceToken()
    }
  }, [fsProfileField?.profileId, notificationEnabled])

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
  }, [channelId])

  return {
    channelId,
    notificationEnabled,
    unregisterDeviceToken,
  }
}

export default useNotification
