import { useEffect, useMemo, useState } from 'react'
import { generateMnemonic } from 'bip39'
import { Wallet } from 'ethers'

import useAuth from 'hooks/independent/useAuth'
import { generateEvmHdAccount } from 'libs/account'

export type UseNewAccountReturn = {
  mnemonic: string
  wallet?: Wallet
  password: string
  setPassword: (value: string) => void
  passwordConfirm: string
  setPasswordConfirm: (value: string) => void
  passwordConfirmErrMsg: string
  isValidForm: boolean
  onClickConfirm: () => Promise<void>
}

const useNewAccount = (): UseNewAccountReturn => {
  const { register } = useAuth()
  const mnemonic = useMemo(() => generateMnemonic(128), [])
  const [wallet, setWallet] = useState<Wallet>()
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
    if (wallet) {
      register({ privateKey: wallet.privateKey, password })
    }
  }

  useEffect(() => {
    generateEvmHdAccount(mnemonic).then(res => {
      setWallet(res)
    })
  }, [mnemonic])

  return {
    mnemonic,
    wallet,
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
