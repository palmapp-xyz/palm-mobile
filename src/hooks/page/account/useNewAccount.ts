import { useMemo, useState } from 'react'
import { useAsyncEffect } from '@sendbird/uikit-utils'

import { generateMnemonic } from 'bip39'
import { Wallet } from 'ethers'

import useAuth from 'hooks/independent/useAuth'
import { generateEvmHdAccount } from 'libs/account'
import { useSetRecoilState } from 'recoil'
import appStore from 'store/appStore'
import { InteractionManager } from 'react-native'

export type UseNewAccountReturn = {
  mnemonic: string | undefined
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
  const [mnemonic, setMnemonic] = useState<string>()
  const [wallet, setWallet] = useState<Wallet>()
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const passwordConfirmErrMsg = useMemo(() => {
    if (password && password !== passwordConfirm) {
      return 'Password does not match'
    }
    return ''
  }, [password, passwordConfirm])

  const setLoading = useSetRecoilState(appStore.loading)

  const isValidForm = !!password && !passwordConfirmErrMsg

  const onClickConfirm = async (): Promise<void> => {
    setLoading(true)
    setTimeout(async () => {
      if (wallet) {
        await register({ privateKey: wallet.privateKey, password })
      }
      setLoading(false)
    }, 500)
  }

  useAsyncEffect(async (): Promise<void> => {
    setLoading(true)
    setTimeout(async () => {
      InteractionManager.runAfterInteractions(async () => {
        setMnemonic(await generateMnemonic(128))
      })
    }, 500)
  }, [])

  useAsyncEffect(async () => {
    if (!mnemonic) {
      return
    }
    await generateEvmHdAccount(mnemonic).then(res => {
      setWallet(res)
      setLoading(false)
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
