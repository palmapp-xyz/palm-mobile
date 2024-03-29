import IStorageProvider from 'palm-core/app/storage'

import AsyncStorage from '@react-native-async-storage/async-storage'

export class AsyncStorageProvider implements IStorageProvider {
  constructor() {}

  async getItem(key: string): Promise<string | null> {
    const result = await AsyncStorage.getItem(key)
    return result ?? null
  }

  async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value)
  }

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key)
  }
}
