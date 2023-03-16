import { useState } from 'react'
import { useAlert } from '@sendbird/uikit-react-native-foundation'

import useAuth from 'hooks/independent/useAuth'

export type UseMainAccountReturn = {
  password: string
  setPassword: (value: string) => void
  isValidForm: boolean
  onClickConfirm: () => Promise<void>
}

const useAuthLogin = (): UseMainAccountReturn => {
  const { login } = useAuth()
  const { alert } = useAlert()
  const [password, setPassword] = useState('')

  const isValidForm = !!password

  const onClickConfirm = async (): Promise<void> => {
    const res = await login({ password })
    if (res.success === false) {
      console.error('useMainAccount:onClickConfirm', res.errMsg)
      alert({ message: res.errMsg })
    }
  }

  return {
    password,
    setPassword,
    isValidForm,
    onClickConfirm,
  }
}

export default useAuthLogin
