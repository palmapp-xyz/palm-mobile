import { web3auth } from 'core/libs/web3auth'
import { useState } from 'react'

import { useAsyncLayoutEffect } from '@sendbird/uikit-utils'
import { State } from '@web3auth/react-native-sdk'

export type UseWeb3AuthReturn = {
  web3auth: {
    hasAuthentication(): boolean
    getAuthentication(): Promise<State | null>
    authenticate(): Promise<State>
    deAuthenticate(): Promise<void>
  }
  loading: boolean
  login: (fn: (cred: State) => Promise<void>) => Promise<void>
  logout: () => Promise<void>
}

const useWeb3Auth = (
  onAutonomousSignIn?: (cred: State) => Promise<void>
): UseWeb3AuthReturn => {
  const [loading, setLoading] = useState(true)

  useAsyncLayoutEffect(async () => {
    await web3auth
      .getAuthentication()
      .then(async response => {
        if (response) {
          await onAutonomousSignIn?.(response)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  return {
    web3auth,
    loading,
    login: async (fn: (cred: State) => Promise<void>): Promise<void> => {
      const cred = await web3auth.authenticate()
      await fn(cred)
    },
    logout: () => web3auth.deAuthenticate(),
  }
}

export default useWeb3Auth
