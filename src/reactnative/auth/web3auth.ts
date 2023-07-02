import Config from 'config'
import EncryptedStorage from 'react-native-encrypted-storage'

import * as WebBrowser from '@toruslabs/react-native-web-browser'
import Web3Auth, {
  LOGIN_PROVIDER,
  OPENLOGIN_NETWORK,
  State,
} from '@web3auth/react-native-sdk'

const clientId = Config.WEB3_AUTH_CLIENT_ID || ''

interface CredentialStorageInterface {
  get(): Promise<State | null>
  set(cred: State): Promise<void>
  delete(): Promise<void>
}

class CredentialStorage implements CredentialStorageInterface {
  private STORAGE_KEY = 'palm@web3auth'
  async get(): Promise<State | null> {
    const cred = await EncryptedStorage.getItem(this.STORAGE_KEY)
    return cred ? JSON.parse(cred) : null
  }
  async set(cred: State): Promise<void> {
    return EncryptedStorage.setItem(this.STORAGE_KEY, JSON.stringify(cred))
  }
  delete(): Promise<void> {
    return EncryptedStorage.removeItem(this.STORAGE_KEY)
  }
}

const createWeb3Auth = (
  credStorage: CredentialStorageInterface
): {
  hasAuthentication(): boolean
  getAuthentication(): Promise<State | null>
  authenticate(): Promise<State>
  deAuthenticate(): Promise<void>
} => {
  const internal: { cred: State | null } = { cred: null }

  const scheme = 'oedimobile'
  const resolvedRedirectUrl = `${scheme}://openlogin`

  const web3auth = new Web3Auth(WebBrowser, {
    clientId,
    network: OPENLOGIN_NETWORK.CELESTE,
  })

  return {
    hasAuthentication(): boolean {
      return Boolean(internal.cred)
    },
    async getAuthentication(): Promise<State | null> {
      if (internal.cred) {
        return internal.cred
      }

      const cred = await credStorage.get()
      if (cred) {
        internal.cred = cred
      }

      return internal.cred
    },
    async authenticate(): Promise<State> {
      const cred = await web3auth.login({
        loginProvider: LOGIN_PROVIDER.GOOGLE,
        redirectUrl: resolvedRedirectUrl,
        mfaLevel: 'default',
        curve: 'secp256k1',
      })
      internal.cred = cred
      credStorage.set(cred)
      return cred
    },
    async deAuthenticate(): Promise<void> {
      await web3auth.logout({ clientId })
      internal.cred = null
      return credStorage.delete()
    },
  }
}

export const web3auth = createWeb3Auth(new CredentialStorage())
