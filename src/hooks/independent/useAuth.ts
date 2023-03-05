import { useRecoilState } from 'recoil'
import { useConnection } from '@sendbird/uikit-react-native'
import _ from 'lodash'

import useWeb3 from 'hooks/complex/useWeb3'
import { savePkey, getPkeyPwd, getPkey } from 'libs/account'
import appStore from 'store/appStore'

import { ContractAddr, TrueOrErrReturn, User } from 'types'

export type UseAuthReturn = {
  user?: User
  register: (props: { privateKey: string; password: string }) => Promise<void>
  login: ({ password }: { password: string }) => Promise<TrueOrErrReturn>
  setAccToken: (accessToken: string) => void
  logout: () => Promise<void>
}

const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useRecoilState(appStore.user)
  const { web3 } = useWeb3()
  const { connect, disconnect } = useConnection()

  const register = async ({
    privateKey,
    password,
  }: {
    privateKey: string
    password: string
  }): Promise<void> => {
    const account = web3.eth.accounts.privateKeyToAccount(privateKey)
    await savePkey(privateKey, password)

    await connect(account.address)
    setUser({ address: account.address as ContractAddr })
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
        await connect(account.address)
        setUser({ address: account.address as ContractAddr })
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
