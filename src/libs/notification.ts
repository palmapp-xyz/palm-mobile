import { Platform } from 'react-native'
import PushNotification, {
  ReceivedNotification,
} from 'react-native-push-notification'

import Notifee, {
  AndroidImportance,
  Event,
  EventType,
} from '@notifee/react-native'
import PushNotificationIOS, {
  PushNotification as iOSPushNotification,
} from '@react-native-community/push-notification-ios'
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import {
  isSendbirdNotification,
  NOOP,
  parseSendbirdNotification,
} from '@sendbird/uikit-utils'

import { recordError } from './logger'
import { navigationRef, Routes, runAfterAppReady } from './navigation'

export const onRemoteNotification: (event: Event) => Promise<void> = async ({
  type,
  detail,
}) => {
  console.log('onRemoteNotification', type, detail)
  if (
    type === EventType.PRESS &&
    detail.notification &&
    isSendbirdNotification(detail.notification.data as any)
  ) {
    const sendbird = parseSendbirdNotification(detail.notification.data as any)
    runAfterAppReady(async (_, actions) => {
      const channelUrl = sendbird.channel.channel_url
      if (Routes.HomeTabs === navigationRef.getCurrentRoute()?.name) {
        actions.push(Routes.GroupChannelList, { channelUrl })
      } else {
        actions.navigate(Routes.GroupChannel, { channelUrl })
      }
    })
  }
}

export const onNotificationIOS = (notification: iOSPushNotification): void => {
  const data = notification.getData()
  const isClicked = data.userInteraction === 1
  if (isClicked && isSendbirdNotification(data)) {
    const sendbird = parseSendbirdNotification(data)
    runAfterAppReady(async (_, actions) => {
      const channelUrl = sendbird.channel.channel_url
      if (Routes.HomeTabs === navigationRef.getCurrentRoute()?.name) {
        actions.push(Routes.GroupChannelList, { channelUrl })
      } else {
        actions.navigate(Routes.GroupChannel, { channelUrl })
      }
    })
  }
  // Use the appropriate result based on what you needed to do for this notification
  const result = PushNotificationIOS.FetchResult.NoData
  notification.finish(result)
}

export const backgroundMessageHandler = async (
  channelId: string,
  message: FirebaseMessagingTypes.RemoteMessage
): Promise<any> => {
  if (Platform.OS !== 'android') {
    return
  }

  console.log('backgroundMessageHandler', channelId, message)
  if (isSendbirdNotification(message.data)) {
    const sendbird = parseSendbirdNotification(message.data)
    await Notifee.displayNotification({
      id: String(sendbird.message_id),
      title: `${
        sendbird.channel.name || sendbird.sender?.name || 'Message received'
      }`,
      body: sendbird.message,
      data: message.data,
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
        largeIcon: sendbird.sender?.profile_url || sendbird.channel.channel_url,
        circularLargeIcon: true,
        pressAction: { id: 'default' },
        showTimestamp: true,
        timestamp: sendbird.created_at,
      },
      ios: {
        threadId: sendbird.channel.channel_url,
        foregroundPresentationOptions: {
          alert: true,
          badge: true,
          sound: true,
        },
      },
    })
  }
}

export const onForegroundAndroid = (): (() => void) =>
  Notifee.onForegroundEvent(onRemoteNotification)

export const onForegroundIOS = (): (() => void) => {
  if (Platform.OS !== 'ios') {
    return NOOP
  }

  const checkAppOpenedWithNotification = async (): Promise<void> => {
    const notification = await PushNotificationIOS.getInitialNotification()
    console.log(
      'PushNotification::checkAppOpenedWithNotification',
      notification
    )
    notification && onNotificationIOS(notification)
  }

  checkAppOpenedWithNotification()
  PushNotificationIOS.addEventListener('localNotification', notification => {
    console.log('PushNotification::localNotificationListener', notification)
    onNotificationIOS(notification)
  })
  PushNotificationIOS.addEventListener('notification', notification => {
    console.log('PushNotification::notificationListener', notification)
    onNotificationIOS(notification)
  })

  return () => [
    PushNotificationIOS.removeEventListener('localNotification'),
    PushNotificationIOS.removeEventListener('notification'),
  ]
}

export const configurePushNotification = (): void => {
  // Must be outside of any component LifeCycle (such as `componentDidMount`).
  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: ({ os, token }: { os: string; token: string }): void => {
      console.log('PushNotification:onRegister', os, token)
    },

    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: (
      notification: Omit<ReceivedNotification, 'userInfo'>
    ): void => {
      console.log('PushNotification::onNotification', notification)
      // (required) Called when a remote is received or opened, or local notification is opened
      notification.finish(PushNotificationIOS.FetchResult.NoData)
    },

    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: (notification: ReceivedNotification): void => {
      console.log('PushNotification:onAction:', notification)
      // process the action
    },

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: (err: unknown): void => {
      console.error('PushNotification:onRegistrationError', err)
      recordError(err, 'PushNotification:onRegistrationError')
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    requestPermissions: true,
  })
}
