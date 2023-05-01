import { Platform } from 'react-native'

import Notifee, {
  AndroidImportance,
  Event,
  EventType,
} from '@notifee/react-native'
import PushNotificationIOS, {
  PushNotification,
} from '@react-native-community/push-notification-ios'
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import {
  isSendbirdNotification,
  NOOP,
  parseSendbirdNotification,
} from '@sendbird/uikit-utils'

import { navigationRef, Routes, runAfterAppReady } from './navigation'

export const onNotificationAndroid: (event: Event) => Promise<void> = async ({
  type,
  detail,
}) => {
  if (Platform.OS !== 'android') {
    return
  }

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

export const onNotificationIOS = (notification: PushNotification): void => {
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
  Notifee.onForegroundEvent(onNotificationAndroid)

export const onForegroundIOS = (): (() => void) => {
  if (Platform.OS !== 'ios') {
    return NOOP
  }

  const checkAppOpenedWithNotification = async (): Promise<void> => {
    const notification = await PushNotificationIOS.getInitialNotification()
    notification && onNotificationIOS(notification)
  }

  checkAppOpenedWithNotification()
  PushNotificationIOS.addEventListener('localNotification', onNotificationIOS)
  return () => PushNotificationIOS.removeEventListener('localNotification')
}
