import { useMemo, useState } from 'react'
import useWeb3 from 'hooks/complex/useWeb3'
import useAuth from 'hooks/independent/useAuth'

export type UseNewAccountReturn = {
  privateKey: string
  password: string
  setPassword: (value: string) => void
  passwordConfirm: string
  setPasswordConfirm: (value: string) => void
  passwordConfirmErrMsg: string
  isValidForm: boolean
  onClickConfirm: () => Promise<void>
}

const useNewAccount = (): UseNewAccountReturn => {
  const { web3 } = useWeb3()

  const { register } = useAuth()
  const privateKey = useMemo(() => web3.eth.accounts.create().privateKey, [])
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
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    passwordConfirmErrMsg,
    isValidForm,
    onClickConfirm,
  }
}

export default useNewAccount
