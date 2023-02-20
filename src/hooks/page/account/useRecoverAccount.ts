import { useMemo, useState } from 'react'
import useAuth from 'hooks/independent/useAuth'

export type UseRecoverAccountReturn = {
  privateKey: string
  setPrivateKey: (value: string) => void
  password: string
  setPassword: (value: string) => void
  passwordConfirm: string
  setPasswordConfirm: (value: string) => void
  passwordConfirmErrMsg: string
  isValidForm: boolean
  onClickConfirm: () => Promise<void>
}

const useRecoverAccount = (): UseRecoverAccountReturn => {
  const { register } = useAuth()
  const [privateKey, setPrivateKey] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const passwordConfirmErrMsg = useMemo(() => {
    if (password && password !== passwordConfirm) {
      return 'Password does not match'
    }
    return ''
  }, [password, passwordConfirm])

  const isValidForm = !!password && !passwordConfirmErrMsg

  const onClickConfirm = async (): Promise<void> => {
    register({ privateKey, password })
  }

  return {
    privateKey,
    setPrivateKey,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    passwordConfirmErrMsg,
    isValidForm,
    onClickConfirm,
  }
}

export default useRecoverAccount
