import { useMemo, useState } from 'react'
import { validateMnemonic } from 'bip39'

import useAuth from 'hooks/independent/useAuth'
import { generateEvmHdAccount } from 'libs/account'

export type UseRecoverAccountReturn = {
  usePkey: boolean
  setUsePkey: (value: boolean) => void
  privateKey: string
  setPrivateKey: (value: string) => void
  mnemonic: string
  setMnemonic: (value: string) => void
  mnemonicErrMsg: string
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
  const [usePkey, setUsePkey] = useState(false)

  const [privateKey, setPrivateKey] = useState('')
  const [mnemonic, setMnemonic] = useState<string>('')
  const mnemonicErrMsg = useMemo(() => {
    if (usePkey === false && mnemonic && validateMnemonic(mnemonic) === false) {
      return 'Invalid mnemonic'
    }
    return ''
  }, [mnemonic, usePkey])

  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const passwordConfirmErrMsg = useMemo(() => {
    if (password && password !== passwordConfirm) {
      return 'Password does not match'
    }
    return ''
  }, [password, passwordConfirm])

  const isValidForm = !!password && !passwordConfirmErrMsg && !mnemonicErrMsg

  const onClickConfirm = async (): Promise<void> => {
    if (usePkey) {
      await register({ privateKey, password })
    } else {
      const wallet = await generateEvmHdAccount(mnemonic)
      await register({ privateKey: wallet.privateKey, password })
    }
  }

  return {
    usePkey,
    setUsePkey,
    privateKey,
    setPrivateKey,
    mnemonic,
    setMnemonic,
    mnemonicErrMsg,
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
