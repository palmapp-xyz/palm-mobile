import { useRecoilState } from 'recoil'
import { useConnection, useSendbirdChat } from '@sendbird/uikit-react-native'
import { SendbirdUser } from '@sendbird/uikit-utils'

import _ from 'lodash'

import useWeb3 from 'hooks/complex/useWeb3'
import { savePkey, getPkeyPwd, getPkey } from 'libs/account'
import appStore from 'store/appStore'

import { SupportedNetworkEnum, TrueOrErrReturn, User } from 'types'
import { formatHex } from 'libs/utils'
import { createFsProfile } from 'libs/firebase'

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
  const { setCurrentUser } = useSendbirdChat()

  const register = async ({
    privateKey,
    password,
  }: {
    privateKey: string
    password: string
  }): Promise<void> => {
    const account = web3.eth.accounts.privateKeyToAccount(formatHex(privateKey))
    await savePkey(privateKey, password)
    const fsUser: User = await createFsProfile(account.address)
    const sbUser: SendbirdUser = await connect(account.address)
    setCurrentUser(sbUser)
    setUser({ ...fsUser, sbUser })
    console.log({ ...fsUser, sbUser })
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
        const fsUser: User = await createFsProfile(account.address)
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
  }

  return { user, register, login, setAccToken, logout }
}

export default useAuth
