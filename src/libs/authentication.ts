import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState } from 'react'

import { useAsyncLayoutEffect } from '@sendbird/uikit-utils'

interface SimpleCredential {
  userId: string
  nickname?: string
}

interface CredentialStorageInterface {
  get(): Promise<SimpleCredential | null>
  set(cred: SimpleCredential): Promise<void>
  delete(): Promise<void>
}

class CredentialStorage implements CredentialStorageInterface {
  private STORAGE_KEY = 'palm@sendbird'
  async get(): Promise<SimpleCredential | null> {
    const cred = await AsyncStorage.getItem(this.STORAGE_KEY)
    return cred ? JSON.parse(cred) : null
  }
  async set(cred: SimpleCredential): Promise<void> {
    return AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(cred))
  }
  delete(): Promise<void> {
    return AsyncStorage.removeItem(this.STORAGE_KEY)
  }
}

const createAuthManager = (
  credStorage: CredentialStorageInterface
): {
  hasAuthentication(): boolean
  getAuthentication(): Promise<SimpleCredential | null>
  authenticate(cred: SimpleCredential): Promise<void>
  deAuthenticate(): Promise<void>
} => {
  const internal: { cred: SimpleCredential | null } = { cred: null }
  return {
    hasAuthentication(): boolean {
      return Boolean(internal.cred)
    },
    async getAuthentication(): Promise<SimpleCredential | null> {
      if (internal.cred) {
        return internal.cred
      }

      const cred = await credStorage.get()
      if (cred) {
        internal.cred = cred
      }

      return internal.cred
    },
    authenticate(cred: SimpleCredential): Promise<void> {
      internal.cred = cred
      return credStorage.set(cred)
    },
    deAuthenticate(): Promise<void> {
      internal.cred = null
      return credStorage.delete()
    },
  }
}

export const authManager = createAuthManager(new CredentialStorage())

export type UseAppAuthReturn = {
  authManager: {
    hasAuthentication(): boolean
    getAuthentication(): Promise<SimpleCredential | null>
    authenticate(cred: SimpleCredential): Promise<void>
    deAuthenticate(): Promise<void>
  }
  loading: boolean
  signIn: (cred: SimpleCredential) => Promise<void>
  signOut: () => Promise<void>
}
export const useAppAuth = (
  onAutonomousSignIn?: (cred: SimpleCredential) => Promise<void>
): UseAppAuthReturn => {
  const [loading, setLoading] = useState(true)

  useAsyncLayoutEffect(async () => {
    await authManager
      .getAuthentication()
      .then(async response => {
        if (response) {
          await onAutonomousSignIn?.(response)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  return {
    authManager,
    loading,
    signIn: (cred: SimpleCredential): Promise<void> =>
      authManager.authenticate(cred),
    signOut: (): Promise<void> => authManager.deAuthenticate(),
  }
}
