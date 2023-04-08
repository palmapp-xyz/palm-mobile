import { useRecoilState } from 'recoil'
import { useConnection, useSendbirdChat } from '@sendbird/uikit-react-native'
import { SendbirdUser } from '@sendbird/uikit-utils'
import firestore from '@react-native-firebase/firestore'
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
} from 'types'
import { formatHex } from 'libs/utils'

export type UseAuthReturn = {
  user?: User
  register: (props: { privateKey: string; password: string }) => Promise<void>
  authenticate: ({ password }: { password: string }) => Promise<TrueOrErrReturn>
  setAccToken: (accessToken: string) => void
  logout: () => Promise<void>
}

const useAuth = (chain?: SupportedNetworkEnum): UseAuthReturn => {
  const [user, setUser] = useRecoilState(appStore.user)
  const { web3 } = useWeb3(chain ?? SupportedNetworkEnum.ETHEREUM)
  const { connect, disconnect } = useConnection()
  const { setCurrentUser } = useSendbirdChat()

  const _registerToFirebase = async (address: ContractAddr): Promise<User> => {
    const profile = firestore().collection('profiles').doc(address)
    const profileDoc = await profile.get()
    let fsUser: User = { address }
    if (!profileDoc.exists) {
      await profile.set(fsUser)
    } else {
      fsUser = profileDoc.data() as User
    }
    return fsUser
  }

  const register = async ({
    privateKey,
    password,
  }: {
    privateKey: string
    password: string
  }): Promise<void> => {
    const account = web3.eth.accounts.privateKeyToAccount(formatHex(privateKey))
    await savePkey(privateKey, password)

    const fsUser = await _registerToFirebase(account.address as ContractAddr)

    const sbUser: SendbirdUser = await connect(account.address)
    setCurrentUser(sbUser)
    setUser({ ...fsUser, sbUser })
  }

  const authenticate = async ({
    password,
  }: {
    password: string
  }): Promise<TrueOrErrReturn> => {
    try {
      const savedPwd = await getPkeyPwd()
      if (savedPwd === password) {
        const privateKey = await getPkey()
        const account = web3.eth.accounts.privateKeyToAccount(privateKey)

        const fsUser = await _registerToFirebase(
          account.address as ContractAddr
        )

        const sbUser: SendbirdUser = await connect(account.address)
        setCurrentUser(sbUser)
        setUser({ ...fsUser, sbUser })
        return { success: true, value: '' }
      } else {
        return { success: false, errMsg: 'Invalid password' }
      }
    } catch (error) {
      return { success: false, errMsg: _.toString(error) }
    }
  }

  const setAccToken = (accessToken: string): void => {
    if (user) {
      const newUser = { ...user, accessToken }
      setUser(newUser)
    }
  }

  const logout = async (): Promise<void> => {
    await disconnect()
    setCurrentUser(undefined)
    setUser(undefined)
    RNRestart.restart()
  }

  return { user, register, authenticate, setAccToken, logout }
}

export default useAuth
