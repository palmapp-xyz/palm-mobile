import { getFsProfile } from 'core/libs/firebase'
import { recordError } from 'core/libs/logger'
import useAuth from 'hooks/auth/useAuth'
import { Platform } from 'react-native'

import firestore from '@react-native-firebase/firestore'
import messaging from '@react-native-firebase/messaging'
import { useSendbirdChat } from '@sendbird/uikit-react-native'

import useNotificationConf from './useNotificationConf'

const useNotificationRegister = (): {
  registerDeviceToken: () => Promise<void>
  unregisterDeviceToken: () => Promise<void>
} => {
  const { sdk } = useSendbirdChat()
  const { user } = useAuth()
  const { checkNotificationPermission } = useNotificationConf()

  const registerDeviceToken = async (): Promise<void> => {
    if ((await checkNotificationPermission(true)) === false) {
      return
    }

    if (!user?.auth?.profileId) {
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
    if (!user?.auth?.profileId) {
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

  return {
    registerDeviceToken,
    unregisterDeviceToken,
  }
}

export default useNotificationRegister
