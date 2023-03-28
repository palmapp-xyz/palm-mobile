import { useMemo, useState } from 'react'
import { validateMnemonic } from 'bip39'

import useAuth from 'hooks/independent/useAuth'
import { generateEvmHdAccount } from 'libs/account'
import { useRecoilState } from 'recoil'
import appStore from 'store/appStore'
import { InteractionManager } from 'react-native'

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
  loading: boolean
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

  const [loading, setLoading] = useRecoilState(appStore.loading)

  const isValidForm = !!password && !passwordConfirmErrMsg && !mnemonicErrMsg

  const onClickConfirm = async (): Promise<void> => {
    setLoading(true)
    setTimeout(async () => {
      if (usePkey) {
        await register({ privateKey, password })
        setLoading(false)
      } else {
        await generateEvmHdAccount(mnemonic).then(
          async (res): Promise<void> => {
            await register({ privateKey: res.privateKey, password })
          }
        )
        setLoading(false)
      }
    }, 500)
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
    loading,
  }
}

export default useRecoverAccount
