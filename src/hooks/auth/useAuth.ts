import { UTIL } from 'consts'
import { AuthenticationResult } from 'graphqls/__generated__/graphql'
import useFsProfile from 'hooks/firestore/useFsProfile'
import useNotification from 'hooks/independent/useNotification'
import useLensAuth from 'hooks/lens/useLensAuth'
import { generateEvmHdAccount, removeKeys, savePkey } from 'libs/account'
import { recordError } from 'libs/logger'
import _ from 'lodash'
import { useState } from 'react'
import { useRecoilState } from 'recoil'
import appStore from 'store/appStore'
import {
  AuthChallengeResult,
  AuthStorageType,
  ContractAddr,
  FbProfile,
  LocalStorageKey,
  SbUserMetadata,
  TrueOrErrReturn,
  User,
} from 'types'

import AsyncStorage from '@react-native-async-storage/async-storage'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
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
  logout: () => Promise<void>
}

const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useRecoilState(appStore.user)
  const { connect, disconnect } = useConnection()
  const { setCurrentUser } = useSendbirdChat()
  const { fetchProfile } = useFsProfile({ profileId: user?.auth?.profileId })

  const {
    authenticate: lensAuthenticate,
    refreshAuthIfExpired: lensRefreshAuthIfExpired,
  } = useLensAuth()
  const [restoreLoading, setRestoreLoading] = useState<boolean>(true)
  const { unregisterDeviceToken } = useNotification({
    profileId: user?.auth?.profileId,
    channelId: 'default',
  })

  const onAuthStateChanged = async (
    firebaseUser: FirebaseAuthTypes.User | null
  ): Promise<void> => {
    if (!user) {
      return
    }

    if (user.address && firebaseUser) {
      setUser({
        ...user,
        userCredential: { ...user.userCredential, user: firebaseUser },
      })
    }
  }

  const registerMnemonic = async (mnemonic: string): Promise<void> => {
    const wallet = await generateEvmHdAccount(mnemonic)
    await savePkey(wallet.privateKey)
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

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
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
    await fetchProfile(authResult.profileId).then(
      (profile: FbProfile | undefined) => {
        if (!profile) {
          throw new Error(
            `User with profide Id ${authResult.profileId} does not exist.`
          )
        }
      }
    )

    const [_userCredential, sbUser, authenticatedUser] = await Promise.all([
      auth().signInWithCustomToken(authResult.authToken),
      connect(authResult.profileId),
      setAuth(authResult),
    ])
    if (!(sbUser.metaData as SbUserMetadata).address) {
      const data: SbUserMetadata = {
        address: authResult.address as ContractAddr,
      }
      await sbUser.createMetaData(data)
    }
    setCurrentUser(sbUser)

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

  const logout = async (): Promise<void> => {
    setCurrentUser(undefined)
    setUser(undefined)
    await AsyncStorage.removeItem(LocalStorageKey.AUTH)
    await removeKeys()
    await Promise.all([auth().signOut(), disconnect(), unregisterDeviceToken()])
    setRestoreLoading(false)
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
