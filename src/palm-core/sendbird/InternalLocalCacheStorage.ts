import { ASYNC_NOOP } from '@sendbird/uikit-utils'

import { KeyValuePairGet, KeyValuePairSet, LocalCacheStorage } from './'

export default class InternalLocalCacheStorage implements LocalCacheStorage {
  constructor(private storage: LocalCacheStorage) {}

  getAllKeys(): Promise<readonly string[] | string[]> {
    return this.storage.getAllKeys()
  }

  getItem(key: string): Promise<string | null> {
    return this.storage.getItem(key)
  }

  removeItem(key: string): Promise<void> {
    return this.storage.removeItem(key)
  }

  setItem(key: string, value: string): Promise<void> {
    return this.storage.setItem(key, value)
  }

  async multiGet(keys: string[]): Promise<readonly KeyValuePairGet[]> {
    if (this.storage.multiGet) {
      return this.storage.multiGet(keys)
    } else {
      return Promise.all(
        keys.map(async key => [key, await this.getItem(key)] as KeyValuePairGet)
      )
    }
  }

  async multiRemove(keys: string[]): Promise<void> {
    if (this.storage.multiRemove) {
      await this.storage.multiRemove(keys)
    } else {
      await Promise.all(keys.map(async key => this.removeItem(key)))
    }
  }

  async multiSet(keyValuePairs: Array<KeyValuePairSet>): Promise<void> {
    if (this.storage.multiSet) {
      await this.storage.multiSet(keyValuePairs)
    } else {
      await Promise.all(
        keyValuePairs.map(([key, value]) => this.storage.setItem(key, value))
      )
    }
  }

  clear = ASYNC_NOOP
  flushGetRequests = ASYNC_NOOP
}
