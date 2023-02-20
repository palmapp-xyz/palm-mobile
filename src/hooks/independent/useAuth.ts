import { useRecoilState } from 'recoil'
import { useConnection } from '@sendbird/uikit-react-native'
import _ from 'lodash'

import useWeb3 from 'hooks/complex/useWeb3'
import { savePkey, savePkeyPwd, getPkeyPwd, getPkey } from 'libs/account'
import appStore from 'store/appStore'

import { ContractAddr, User } from 'types'

export type UseAuthReturn = {
  user?: User
  register: (props: { privateKey: string; password: string }) => Promise<void>
  login: ({ password }: { password: string }) => Promise<
    | {
        success: true
      }
    | {
        success: false
        errMsg: string
      }
  >
}

const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useRecoilState(appStore.user)
  const { web3 } = useWeb3()
  const { connect } = useConnection()

  const register = async ({
    privateKey,
    password,
  }: {
    privateKey: string
    password: string
  }): Promise<void> => {
    const account = web3.eth.accounts.privateKeyToAccount(privateKey)
    setUser({ address: account.address as ContractAddr })

    await savePkey(privateKey)
    await savePkeyPwd(password)
    await connect(account.address, { nickname: account.address })
  }

  const login = async ({
    password,
  }: {
    password: string
  }): Promise<{ success: true } | { success: false; errMsg: string }> => {
    try {
      const savedPwd = await getPkeyPwd()
      if (savedPwd === password) {
        const privateKey = await getPkey()
        const account = web3.eth.accounts.privateKeyToAccount(privateKey)
        setUser({ address: account.address as ContractAddr })
        await connect(account.address, { nickname: account.address })
        return { success: true }
      } else {
        return { success: false, errMsg: 'Invalid password' }
      }
    } catch (error) {
      return { success: false, errMsg: _.toString(error) }
    }
  }

  return { user, register, login }
}

export default useAuth
