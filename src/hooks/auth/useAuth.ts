import { AuthenticationResult } from 'core/graphqls/__generated__/graphql'
import { UTIL } from 'core/libs'
import { getFsProfile } from 'core/libs/firebase'
import { recordError } from 'core/libs/logger'
import { resetNewPin, resetPin } from 'core/libs/pin'
import appStore from 'core/store/appStore'
import {
  AuthChallengeResult,
  AuthStorageType,
  ContractAddr,
  FbProfile,
  LocalStorageKey,
  SbUserMetadata,
  TrueOrErrReturn,
  User,
} from 'core/types'
import useLensAuth from 'hooks/lens/useLensAuth'
import PkeyManager from 'libs/PkeyManager'
import _ from 'lodash'
import { useState } from 'react'
import RNRestart from 'react-native-restart'
import { useRecoilState, useSetRecoilState } from 'recoil'

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
  const setLoading = useSetRecoilState(appStore.loading)

  const {
    authenticate: lensAuthenticate,
    refreshAuthIfExpired: lensRefreshAuthIfExpired,
  } = useLensAuth()
  const [restoreLoading, setRestoreLoading] = useState<boolean>(true)

  const onAuthStateChanged = async (
    firebaseUser: FirebaseAuthTypes.User | null
  ): Promise<void> => {
    if (!user) {
      return
    }

    if (user.auth && firebaseUser) {
      const authToken: string = await firebaseUser.getIdToken(true)
      await setAuth({ ...user.auth, authToken })

      setUser({
        ...user,
        userCredential: { ...user.userCredential, user: firebaseUser },
      })
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
    await getFsProfile(authResult.profileId).then(
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
        auth().currentUser
          ? auth()
              .currentUser?.getIdToken(true)
              .then((authToken: string) => {
                setAuth({ ...authResult, authToken })
              })
          : auth().signInWithCustomToken(authResult.authToken)
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
    await Promise.all([
      AsyncStorage.clear(),
      PkeyManager.removeKeys(),
      auth().signOut(),
      disconnect(),
      resetPin(),
      resetNewPin(),
    ])

    setCurrentUser(undefined)
    setRestoreLoading(false)
    setUser(undefined)

    setLoading(true)
    RNRestart.restart()
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
