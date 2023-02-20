import { useState } from 'react'
import { Alert } from 'react-native'

import useAuth from 'hooks/independent/useAuth'

export type UseMainAccountReturn = {
  password: string
  setPassword: (value: string) => void
  isValidForm: boolean
  onClickConfirm: () => Promise<void>
}

const useMainAccount = (): UseMainAccountReturn => {
  const { login } = useAuth()
  const [password, setPassword] = useState('')

  const isValidForm = !!password

  const onClickConfirm = async (): Promise<void> => {
    const res = await login({ password })
    if (res.success === false) {
      Alert.alert('Sorry', res.errMsg)
    }
  }

  return {
    password,
    setPassword,
    isValidForm,
    onClickConfirm,
  }
}

export default useMainAccount
