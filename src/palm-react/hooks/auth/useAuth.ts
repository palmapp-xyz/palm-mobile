import { setUserId, setUserProperties } from 'firebase/analytics'
import _ from 'lodash'
import {
  User as AuthUser,
  analytics,
  appAuth,
  signInWithCustomToken,
} from 'palm-core/firebase'
import { AuthenticationResult } from 'palm-core/graphqls'
import { UTIL } from 'palm-core/libs'
import { getProfileDoc } from 'palm-core/libs/firebase'
import { recordError } from 'palm-core/libs/logger'
import {
  AuthChallengeResult,
  AuthStorageType,
  ContractAddr,
  FbProfile,
  LocalStorageKey,
  SbUserMetadata,
  TrueOrErrReturn,
  User,
} from 'palm-core/types'
import PkeyManager from 'palm-react-native/app/pkeyManager'
import useLensAuth from 'palm-react/hooks/lens/useLensAuth'
import appStore from 'palm-react/store/appStore'
import { useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { useConnection, useSendbirdChat } from '@sendbird/uikit-react-native'
import { useAsyncEffect } from '@sendbird/uikit-utils'

export type UseAuthReturn = {
  user?: User
  restoreLoading: boolean
  registerMnemonic: (mnemonic: string) => Promise<void>
  lensLogin: () => Promise<TrueOrErrReturn<AuthenticationResult | null>>
  setAuth: (result: AuthChallengeResult) => Promise<User>
  setLensAuth: (lensAuth: AuthenticationResult) => Promise<void>
  appSignIn: (authResult: AuthChallengeResult) => Promise<User>
  logout: (onLogout?: () => void) => Promise<void>
}

const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useRecoilState(appStore.user)
  const { connect, disconnect } = useConnection()
  const { setCurrentUser } = useSendbirdChat()
  const setLoading = useSetRecoilState(appStore.loading)

  const {
    authenticate: lensAuthenticate,
    refreshAuthIfExpired: lensRefreshAuthIfExpired,
  } = useLensAuth()
  const [restoreLoading, setRestoreLoading] = useState<boolean>(true)

  const onAuthStateChanged = async (
    firebaseUser: AuthUser | null
  ): Promise<void> => {
    if (!user) {
      return
    }

    if (user.auth && firebaseUser) {
      const authToken: string = await firebaseUser.getIdToken(true)
      await setAuth({ ...user.auth, authToken })
    }

    if (!firebaseUser) {
      console.log(
        `User ${user.auth?.profileId} logged out. address ${user.address}`
      )
    }
  }

  const registerMnemonic = async (mnemonic: string): Promise<void> => {
    const wallet = await PkeyManager.generateEvmHdAccount(mnemonic)
    await PkeyManager.savePkey(wallet.privateKey)
    await PkeyManager.saveMnemonic(mnemonic)
  }

  const restoreAuth = async (restore: AuthStorageType): Promise<void> => {
    if (restore.auth) {
      try {
        await appSignIn(restore.auth)
        if (restore.lensAuth) {
          const res = await lensRefreshAuthIfExpired(restore.lensAuth)
          if (res.success) {
            await setLensAuth(res.value ?? restore.lensAuth)
          }
        }
      } catch (e) {
        recordError(e, 'useAuth:restoreAuth')
        await logout()
      }
    }
  }

  useAsyncEffect(async () => {
    if (!user) {
      const item = await AsyncStorage.getItem(LocalStorageKey.AUTH)
      const result = UTIL.jsonTryParse<AuthStorageType>(item || '')
      if (result) {
        await restoreAuth(result)
      }
    }
    setRestoreLoading(false)

    const subscriber = appAuth.onAuthStateChanged(onAuthStateChanged)
    return subscriber
  }, [])

  const storeAuth = async (input: Partial<AuthStorageType>): Promise<void> => {
    if (user) {
      await AsyncStorage.setItem(
        LocalStorageKey.AUTH,
        JSON.stringify({
          address: input.address || user.address,
          lensAuth: input.lensAuth || user.lensAuth,
          auth: input.auth || user.auth,
        } as AuthStorageType)
      )
    }
  }

  const appSignIn = async (authResult: AuthChallengeResult): Promise<User> => {
    // if user profile is deleted from the db, logout for re-authentication
    await getProfileDoc(authResult.profileId).then(
      (profile: FbProfile | undefined) => {
        if (!profile) {
          throw new Error(
            `User with profide Id ${authResult.profileId} does not exist.`
          )
        }
      }
    )

    const authSignIn = async (): Promise<void> => {
      try {
        appAuth.currentUser
          ? appAuth.currentUser.getIdToken(true).then((authToken: string) => {
              setAuth({ ...authResult, authToken })
            })
          : signInWithCustomToken(appAuth, authResult.authToken)
      } catch (e) {
        recordError(e, `authSignIn:${authResult.authToken}`)
        throw e
      }
    }

    const [_void, sbUser, authenticatedUser] = await Promise.all([
      authSignIn(),
      connect(authResult.profileId),
      setAuth(authResult),
    ])
    if (!(sbUser.metaData as SbUserMetadata).address) {
      const data: SbUserMetadata = {
        address: authResult.address as ContractAddr,
        profileId: authResult.profileId,
      }
      await sbUser.createMetaData(data)
    }
    setCurrentUser(sbUser)

    setUserId(analytics, authResult.profileId)
    setUserProperties(analytics, {
      address: authResult.address as ContractAddr,
    })

    console.log(
      'App signed in as',
      _.pick(authenticatedUser.auth, ['profileId', 'address'])
    )
    return authenticatedUser
  }

  const lensLogin = async (): Promise<
    TrueOrErrReturn<AuthenticationResult | null>
  > => {
    try {
      const res = await lensAuthenticate()
      if (!res.success) {
        throw new Error(res.errMsg)
      }

      await setLensAuth(res.value)
      return res
    } catch (error) {
      recordError(error, 'useAuth:lensLogin')
      return { success: false, errMsg: JSON.stringify(error) }
    }
  }

  const setAuth = async (result: AuthChallengeResult): Promise<User> => {
    await storeAuth({ auth: result })

    const authenticatedUser: User = {
      ...user,
      auth: result,
      address: result.address as ContractAddr,
    }
    setUser(authenticatedUser)
    return authenticatedUser
  }

  const setLensAuth = async (
    lensAuth: AuthenticationResult | null
  ): Promise<void> => {
    if (!user) {
      return
    }
    await storeAuth({ lensAuth })

    const lensUser: User = {
      ...user,
      lensAuth,
    }
    setUser(lensUser)
  }

  const logout = async (onLogout?: () => void): Promise<void> => {
    await Promise.all([
      AsyncStorage.clear(),
      PkeyManager.removeKeys(),
      appAuth.signOut(),
      disconnect(),
      PkeyManager.resetPin(),
      PkeyManager.resetNewPin(),
    ])

    setCurrentUser(undefined)
    setRestoreLoading(false)
    setUser(undefined)

    setLoading(true)
    onLogout?.()
  }

  return {
    user,
    restoreLoading,
    registerMnemonic,
    lensLogin,
    setAuth,
    setLensAuth,
    appSignIn,
    logout,
  }
}

export default useAuth
