import { useRecoilState } from 'recoil'
import firestore from '@react-native-firebase/firestore'
import { useConnection } from '@sendbird/uikit-react-native'
import { SendbirdUser } from '@sendbird/uikit-utils'

import _ from 'lodash'

import useWeb3 from 'hooks/complex/useWeb3'
import { savePkey, getPkeyPwd, getPkey } from 'libs/account'
import appStore from 'store/appStore'

import {
  ContractAddr,
  SupportedNetworkEnum,
  TrueOrErrReturn,
  User,
} from 'types'
import { formatHex } from 'libs/utils'

export type UseAuthReturn = {
  user?: User
  register: (props: { privateKey: string; password: string }) => Promise<void>
  login: ({ password }: { password: string }) => Promise<TrueOrErrReturn>
  setAccToken: (accessToken: string) => void
  logout: () => Promise<void>
}

const useAuth = (chain?: SupportedNetworkEnum): UseAuthReturn => {
  const [user, setUser] = useRecoilState(appStore.user)
  const { web3 } = useWeb3(chain ?? SupportedNetworkEnum.ETHEREUM)
  const { connect, disconnect } = useConnection()

  const authenticateUser = async (address: string): Promise<void> => {
    const profile = firestore().collection('profiles').doc(address)
    const profileDoc = await profile.get()

    let fsUser: User = {
      address: address as ContractAddr,
    }
    if (!profileDoc.exists) {
      await firestore().collection('profiles').doc(address).set(fsUser)
    } else {
      fsUser = (await profileDoc.data()) as User
    }

    const sbUser: SendbirdUser = await connect(address)
    setUser({ ...fsUser, sbUser })
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
    await authenticateUser(account.address)
  }

  const login = async ({
    password,
  }: {
    password: string
  }): Promise<TrueOrErrReturn> => {
    try {
      const savedPwd = await getPkeyPwd()
      if (savedPwd === password) {
        const privateKey = await getPkey()
        const account = web3.eth.accounts.privateKeyToAccount(privateKey)
        await authenticateUser(account.address)
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
    setUser(undefined)
  }

  return { user, register, login, setAccToken, logout }
}

export default useAuth
