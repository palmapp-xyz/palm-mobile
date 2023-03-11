import { useState } from 'react'
import { useAlert } from '@sendbird/uikit-react-native-foundation'
import { useQuery } from 'react-query'

import useAuth from 'hooks/independent/useAuth'
import { getPkeyPwd } from 'libs/account'
import { KeyChainEnum } from 'types'

export type UseMainAccountReturn = {
  hasStoredKey: boolean
  password: string
  setPassword: (value: string) => void
  isValidForm: boolean
  onClickConfirm: () => Promise<void>
}

const useMainAccount = (): UseMainAccountReturn => {
  const { login } = useAuth()
  const { alert } = useAlert()
  const [password, setPassword] = useState('')

  const isValidForm = !!password

  const { data: hasStoredKey = false } = useQuery(
    [KeyChainEnum.PK_PWD],
    async () => {
      const somePwd = await getPkeyPwd()
      return !!somePwd
    }
  )

  const onClickConfirm = async (): Promise<void> => {
    const res = await login({ password })
    if (res.success === false) {
      console.error('useMainAccount:onClickConfirm', res.errMsg)
      alert({ message: res.errMsg })
    }
  }

  return {
    hasStoredKey,
    password,
    setPassword,
    isValidForm,
    onClickConfirm,
  }
}

export default useMainAccount
