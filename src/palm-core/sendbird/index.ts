import { Unsubscribe } from 'palm-core/firebase'

import SendbirdChat, { OnlineDetectorListener } from '@sendbird/chat'
import { GroupChannelModule } from '@sendbird/chat/groupChannel'

import InternalLocalCacheStorage from './InternalLocalCacheStorage'

export type KeyValuePairGet = [string, string | null]
export type KeyValuePairSet = [string, string]

export interface LocalCacheStorage {
  getAllKeys(): Promise<readonly string[] | string[]>
  getItem(key: string): Promise<string | null>
  setItem(key: string, value: string): Promise<void>
  removeItem(key: string): Promise<void>

  multiSet?(keyValuePairs: Array<KeyValuePairSet>): Promise<void>
  multiGet?(
    keys: string[]
  ): Promise<readonly KeyValuePairGet[] | KeyValuePairGet[]>
  multiRemove?(keys: string[]): Promise<void>
}

export type UserOnlineStateListener = (
  callback: () => void,
  callbackType: 'online' | 'offline'
) => Unsubscribe

export const initializeSendbird = (
  appId: string,
  internalStorage?: InternalLocalCacheStorage,
  onInitialized?: (sdk: SendbirdChat) => SendbirdChat,
  onlineDetectListener?: {
    online: OnlineDetectorListener
    offline: OnlineDetectorListener
  }
): SendbirdChat => {
  let chatSDK: SendbirdChat

  chatSDK = SendbirdChat.init({
    appId,
    modules: [new GroupChannelModule()],
    localCacheEnabled: Boolean(internalStorage),
    useAsyncStorageStore: internalStorage as never,
    newInstance: true,
  })

  if (onInitialized) {
    chatSDK = onInitialized(chatSDK)
  }

  if (chatSDK.setOnlineListener) {
    onlineDetectListener?.online &&
      chatSDK.setOnlineListener?.(onlineDetectListener.online)
    onlineDetectListener?.offline &&
      chatSDK.setOfflineListener?.(onlineDetectListener.offline)
  }

  return chatSDK
}
