import { useMemo, useState } from 'react'
import useWeb3 from 'hooks/complex/useWeb3'
import useAuth from 'hooks/independent/useAuth'
import { ContractAddr } from 'types'

export type UseNewAccountReturn = {
  address: ContractAddr
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
  const created = useMemo(() => web3.eth.accounts.create(), [])
  const address = created.address as ContractAddr
  const privateKey = created.privateKey
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
    address,
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
