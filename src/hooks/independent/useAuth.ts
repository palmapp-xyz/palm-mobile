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
  AuthChallengeInfo,
} from 'types'
import { formatHex } from 'libs/utils'
import useFsProfile from 'hooks/firestore/useFsProfile'
import useAuthChallenge from 'hooks/api/useAuthChallenge'

export type UseAuthReturn = {
  user?: User

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
  const { fetchProfile } = useFsProfile({})
  const { challengeRequest, challengeVerify } = useAuthChallenge(
    chain ?? SupportedNetworkEnum.ETHEREUM
  )

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

      const sbUser: SendbirdUser = await connect(result.profileId)
      setCurrentUser(sbUser)

      const fsUser: User | undefined = await fetchProfile(result.profileId)
      if (!fsUser) {
        throw new Error(`User ${result.profileId} does not exist`)
      }
      setUser({ ...fsUser, sbUser })

      return { success: true, value: result }
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
    registerRequest,
    authenticateRequest,
    authenticate,
    fetchUserProfileId,
    setAuth,
    setLensAccToken,
    logout,
  }
}

export default useAuth
