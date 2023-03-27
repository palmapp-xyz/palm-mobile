import { useState } from 'react'

import useAuth from 'hooks/independent/useAuth'
import { Alert } from 'react-native'

export type UseMainAccountReturn = {
  password: string
  setPassword: (value: string) => void
  isValidForm: boolean
  onClickConfirm: () => Promise<void>
}

const useAuthLogin = (): UseMainAccountReturn => {
  const { login } = useAuth()
  const [password, setPassword] = useState('')

  const isValidForm = !!password

  const onClickConfirm = async (): Promise<void> => {
    const res = await login({ password })
    if (res.success === false) {
      console.error('useMainAccount:onClickConfirm', res.errMsg)
      Alert.alert('Login Failed', res.errMsg)
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
