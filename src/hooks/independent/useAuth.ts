import { useRecoilState } from 'recoil'
import { useConnection, useSendbirdChat } from '@sendbird/uikit-react-native'
import { SendbirdUser } from '@sendbird/uikit-utils'
import _ from 'lodash'
import RNRestart from 'react-native-restart'

import useWeb3 from 'hooks/complex/useWeb3'
import { savePkey, getPkeyPwd, getPkey } from 'libs/account'
import appStore from 'store/appStore'

import {
  SupportedNetworkEnum,
  TrueOrErrReturn,
  User,
  ContractAddr,
  AuthChallengeResult,
  ApiEnum,
  AuthChallengeInfo,
} from 'types'
import { formatHex } from 'libs/utils'
import useApi from 'hooks/complex/useApi'
import apiV1Fabricator from 'libs/apiV1Fabricator'
import useNetwork from 'hooks/complex/useNetwork'
import useFsProfile from 'hooks/firestore/useFsProfile'

export type UseAuthReturn = {
  user?: User
  register: (props: {
    privateKey: string
    password: string
  }) => Promise<TrueOrErrReturn<string>>
  authenticate: ({
    password,
  }: {
    password: string
  }) => Promise<TrueOrErrReturn<string>>
  challengeRequest: (address: ContractAddr) => Promise<AuthChallengeInfo>
  challengeVerify: (
    signature: string,
    message: string
  ) => Promise<AuthChallengeResult>
  fetchUserProfileId: (
    userAddress: ContractAddr | undefined
  ) => Promise<string | undefined>
  setAuth: (result: AuthChallengeResult) => void
  setLensAccToken: (lensAccToken: string) => void
  logout: () => Promise<void>
}

const useAuth = (chain?: SupportedNetworkEnum): UseAuthReturn => {
  const [user, setUser] = useRecoilState(appStore.user)
  const { web3 } = useWeb3(chain ?? SupportedNetworkEnum.ETHEREUM)
  const { connect, disconnect } = useConnection()
  const { setCurrentUser } = useSendbirdChat()
  const { postApi } = useApi()
  const { fetchProfile } = useFsProfile({})
  const { connectedNetworkIds } = useNetwork()
  const connectedNetworkId = connectedNetworkIds[SupportedNetworkEnum.ETHEREUM]

  const challengeRequest = async (
    address: ContractAddr
  ): Promise<AuthChallengeInfo> => {
    const fetchRes = await postApi<ApiEnum.AUTH_CHALLENGE_REQUEST>({
      path: apiV1Fabricator[ApiEnum.AUTH_CHALLENGE_REQUEST].post(),
      params: {
        address,
        chainId: connectedNetworkId,
      },
    })

    if (!fetchRes.success) {
      throw new Error(fetchRes.errMsg)
    }
    return fetchRes.data
  }

  const challengeVerify = async (
    signature: string,
    message: string
  ): Promise<AuthChallengeResult> => {
    const fetchRes = await postApi<ApiEnum.AUTH_CHALLENGE_VERIFY>({
      path: apiV1Fabricator[ApiEnum.AUTH_CHALLENGE_VERIFY].post(),
      params: {
        signature,
        message,
      },
    })

    if (!fetchRes.success) {
      throw new Error(fetchRes.errMsg)
    }
    return fetchRes.data
  }

  const fetchUserProfileId = async (
    userAddress: ContractAddr | undefined
  ): Promise<string | undefined> => {
    if (!userAddress) {
      return undefined
    }
    try {
      const result = await challengeRequest(userAddress)
      return result.profileId
    } catch (error) {
      return undefined
    }
  }

  const register = async ({
    privateKey,
    password,
  }: {
    privateKey: string
    password: string
  }): Promise<TrueOrErrReturn<string>> => {
    try {
      const account = web3.eth.accounts.privateKeyToAccount(
        formatHex(privateKey)
      )
      await savePkey(privateKey, password)

      const challenge = await challengeRequest(account.address as ContractAddr)
      const signature = account.sign(challenge.message).signature
      const result = await challengeVerify(signature, challenge.message)

      const sbUser: SendbirdUser = await connect(result.profileId)
      setCurrentUser(sbUser)

      const fsUser: User | undefined = await fetchProfile(result.profileId)
      if (!fsUser) {
        throw new Error(`User ${result.profileId} does not exist`)
      }
      setUser({ ...fsUser, auth: result, sbUser })

      return { success: true, value: result.nonce }
    } catch (error) {
      return { success: false, errMsg: _.toString(error) }
    }
  }

  const authenticate = async ({
    password,
  }: {
    password: string
  }): Promise<TrueOrErrReturn<string>> => {
    try {
      const savedPwd = await getPkeyPwd()
      if (savedPwd === password) {
        const privateKey = await getPkey()
        const account = web3.eth.accounts.privateKeyToAccount(privateKey)

        const challenge = await challengeRequest(
          account.address as ContractAddr
        )
        const signature = account.sign(challenge.message).signature
        const result = await challengeVerify(signature, challenge.message)

        const sbUser: SendbirdUser = await connect(result.profileId)
        setCurrentUser(sbUser)

        const fsUser: User | undefined = await fetchProfile(result.profileId)
        if (!fsUser) {
          throw new Error(`User ${result.profileId} does not exist`)
        }
        setUser({ ...fsUser, auth: result, sbUser })

        return { success: true, value: result.nonce }
      } else {
        return { success: false, errMsg: 'Invalid password' }
      }
    } catch (error) {
      return { success: false, errMsg: _.toString(error) }
    }
  }

  const setAuth = (result: AuthChallengeResult): void => {
    if (user) {
      const newUser = { ...user, auth: result }
      setUser(newUser)
    }
  }

  const setLensAccToken = (lensAccessToken: string): void => {
    if (user) {
      const newUser = { ...user, lensAccessToken }
      setUser(newUser)
    }
  }

  const logout = async (): Promise<void> => {
    await disconnect()
    setCurrentUser(undefined)
    setUser(undefined)
    RNRestart.restart()
  }

  return {
    user,
    register,
    authenticate,
    challengeRequest,
    challengeVerify,
    fetchUserProfileId,
    setAuth,
    setLensAccToken,
    logout,
  }
}

export default useAuth
