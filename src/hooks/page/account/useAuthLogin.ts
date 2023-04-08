import { useState } from 'react'

import useAuth from 'hooks/independent/useAuth'
import { Alert } from 'react-native'

export type UseMainAccountReturn = {
  password: string
  setPassword: (value: string) => void
  isValidForm: boolean
  login: () => Promise<void>
}

const useAuthLogin = (): UseMainAccountReturn => {
  const { authenticate } = useAuth()
  const [password, setPassword] = useState('')

  const isValidForm = !!password

  const login = async (): Promise<void> => {
    const res = await authenticate({ password })
    if (res.success === false) {
      console.error('useMainAccount:login', res.errMsg)
      Alert.alert('Login Failed', res.errMsg)
    }
  }

  return {
    password,
    setPassword,
    isValidForm,
    login,
  }
}

export default useAuthLogin
