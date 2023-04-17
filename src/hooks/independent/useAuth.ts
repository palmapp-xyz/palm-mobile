import { useRecoilState } from 'recoil'
import { useConnection, useSendbirdChat } from '@sendbird/uikit-react-native'
import { SendbirdUser, useAsyncEffect } from '@sendbird/uikit-utils'
import _ from 'lodash'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'

import useWeb3 from 'hooks/complex/useWeb3'
import { savePkey, getPkeyPwd, getPkey } from 'libs/account'
import appStore from 'store/appStore'

import {
  SupportedNetworkEnum,
  TrueOrErrReturn,
  User,
  ContractAddr,
  AuthChallengeResult,
  AuthChallengeInfo,
  LocalStorageKey,
  AuthStorageType,
} from 'types'
import { formatHex } from 'libs/utils'
import useFsProfile from 'hooks/firestore/useFsProfile'
import useAuthChallenge from 'hooks/api/useAuthChallenge'
import { AuthenticationResult } from 'graphqls/__generated__/graphql'
import AsyncStorage from '@react-native-async-storage/async-storage'
import useLensAuth from 'hooks/lens/useLensAuth'
import { UTIL } from 'consts'
import { useEffect, useState } from 'react'
import { profilesDeepCompare } from 'libs/profile'

export type UseAuthReturn = {
  user?: User
  restoreLoading: boolean
  registerRequest: (props: {
    privateKey: string
    password: string
  }) => Promise<TrueOrErrReturn<AuthChallengeInfo>>
  authenticateRequest: ({
    password,
  }: {
    password: string
  }) => Promise<TrueOrErrReturn<AuthChallengeInfo>>
  authenticate: ({
    challenge,
  }: {
    challenge: AuthChallengeInfo
  }) => Promise<TrueOrErrReturn<AuthChallengeResult>>
  lensLogin: () => Promise<TrueOrErrReturn<AuthenticationResult | null>>
  fetchUserProfileId: (
    userAddress: ContractAddr | undefined
  ) => Promise<string | undefined>
  setAuth: (currentUser: User, result: AuthChallengeResult) => Promise<User>
  setLensAuth: (
    currentUser: User,
    lensAuth: AuthenticationResult
  ) => Promise<void>
  logout: () => Promise<void>
}

const useAuth = (chain?: SupportedNetworkEnum): UseAuthReturn => {
  const [user, setUser] = useRecoilState(appStore.user)
  const { web3 } = useWeb3(chain ?? SupportedNetworkEnum.ETHEREUM)
  const { connect, disconnect } = useConnection()
  const { setCurrentUser } = useSendbirdChat()
  const { fsProfileField, fetchProfile } = useFsProfile({
    profileId: user?.profileId,
  })
  const { challengeRequest, challengeVerify } = useAuthChallenge(
    chain ?? SupportedNetworkEnum.ETHEREUM
  )
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

    if (user.address && firebaseUser) {
      setUser({
        ...user,
        userCredential: { ...user.userCredential, user: firebaseUser },
      })
    }
  }

  const restoreAuth = async (restore: AuthStorageType): Promise<void> => {
    if (restore.auth) {
      try {
        const currentUser = await appSignIn(restore.auth)
        if (restore.lensAuth) {
          const res = await lensRefreshAuthIfExpired(restore.lensAuth)
          if (res.success) {
            await setLensAuth(currentUser, res.value ?? restore.lensAuth)
          }
        }
      } catch (e) {
        console.error('useAuth:restoreAuth', e)
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

  useEffect(() => {
    if (!user || !fsProfileField) {
      return
    }

    if (profilesDeepCompare(user, fsProfileField) === false) {
      setUser({
        ...user,
        ...fsProfileField,
      })
    }
  }, [user, fsProfileField])

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

  const fetchUserProfileId = async (
    userAddress: ContractAddr | undefined
  ): Promise<string | undefined> => {
    if (!userAddress) {
      return undefined
    }
    const result = await challengeRequest(userAddress)
    return result.profileId
  }

  const registerRequest = async ({
    privateKey,
    password,
  }: {
    privateKey: string
    password: string
  }): Promise<TrueOrErrReturn<AuthChallengeInfo>> => {
    try {
      const account = web3.eth.accounts.privateKeyToAccount(
        formatHex(privateKey)
      )
      await savePkey(privateKey, password)

      const challenge = await challengeRequest(account.address as ContractAddr)
      return { success: true, value: challenge }
    } catch (error) {
      return { success: false, errMsg: _.toString(error) }
    }
  }

  const authenticateRequest = async ({
    password,
  }: {
    password: string
  }): Promise<TrueOrErrReturn<AuthChallengeInfo>> => {
    try {
      const savedPwd = await getPkeyPwd()
      if (savedPwd === password) {
        const privateKey = await getPkey()
        const account = web3.eth.accounts.privateKeyToAccount(privateKey)

        const challenge = await challengeRequest(
          account.address as ContractAddr
        )
        return { success: true, value: challenge }
      } else {
        return { success: false, errMsg: 'Invalid password' }
      }
    } catch (error) {
      return { success: false, errMsg: _.toString(error) }
    }
  }

  const appSignIn = async (authResult: AuthChallengeResult): Promise<User> => {
    const userCredential: FirebaseAuthTypes.UserCredential =
      await auth().signInWithCustomToken(authResult.authToken)

    const fsUser: User | undefined = await fetchProfile(authResult.profileId)
    if (!fsUser) {
      throw new Error(`User ${authResult.profileId} does not exist`)
    }

    const sbUser: SendbirdUser = await connect(authResult.profileId)
    setCurrentUser(sbUser)

    const r: User = { ...fsUser, userCredential, sbUser }
    const authenticatedUser = await setAuth(r, authResult)

    console.log(
      'App signed in as',
      _.pick(authenticatedUser, ['profileId', 'address'])
    )
    return authenticatedUser
  }

  const authenticate = async ({
    challenge,
  }: {
    challenge: AuthChallengeInfo
  }): Promise<TrueOrErrReturn<AuthChallengeResult>> => {
    try {
      const privateKey = await getPkey()
      const account = web3.eth.accounts.privateKeyToAccount(privateKey)

      const signature = account.sign(challenge.message).signature
      const result = await challengeVerify(signature, challenge.message)

      await appSignIn(result)
      return { success: true, value: result }
    } catch (error) {
      return { success: false, errMsg: _.toString(error) }
    }
  }

  const lensLogin = async (): Promise<
    TrueOrErrReturn<AuthenticationResult | null>
  > => {
    try {
      const res = await lensAuthenticate()
      if (!res.success) {
        throw new Error(res.errMsg)
      }

      await setLensAuth(user!, res.value)
      return res
    } catch (error) {
      console.error('useAuth:lensLogin', error)
      return { success: false, errMsg: JSON.stringify(error) }
    }
  }

  const setAuth = async (
    currentUser: User,
    result: AuthChallengeResult
  ): Promise<User> => {
    await storeAuth({ auth: result })

    const authenticatedUser: User = {
      ...currentUser,
      auth: result,
      address: result.address as ContractAddr,
      profileId: result.profileId,
    }
    setUser(authenticatedUser)
    return authenticatedUser
  }

  const setLensAuth = async (
    currentUser: User,
    lensAuth: AuthenticationResult | null
  ): Promise<void> => {
    await storeAuth({ lensAuth })

    const lensUser: User = {
      ...currentUser,
      lensAuth,
    }
    setUser(lensUser)
  }

  const logout = async (): Promise<void> => {
    await AsyncStorage.removeItem(LocalStorageKey.AUTH)
    await Promise.all([auth().signOut(), disconnect()])
    setCurrentUser(undefined)
    setUser(undefined)
  }

  return {
    user,
    restoreLoading,
    registerRequest,
    authenticateRequest,
    authenticate,
    lensLogin,
    fetchUserProfileId,
    setAuth,
    setLensAuth,
    logout,
  }
}

export default useAuth
