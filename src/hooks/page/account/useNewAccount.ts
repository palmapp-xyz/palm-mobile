import { useMemo, useState } from 'react'
import { useAsyncEffect } from '@sendbird/uikit-utils'

import { generateMnemonic } from 'bip39'
import { Wallet } from 'ethers'

import useAuth from 'hooks/auth/useAuth'
import { generateEvmHdAccount } from 'libs/account'
import { useSetRecoilState } from 'recoil'
import appStore from 'store/appStore'
import { InteractionManager } from 'react-native'
import { AuthChallengeInfo } from 'types'
import _ from 'lodash'

export type UseNewAccountReturn = {
  mnemonic: string | undefined
  wallet?: Wallet
  password: string
  setPassword: (value: string) => void
  passwordConfirm: string
  setPasswordConfirm: (value: string) => void
  passwordConfirmErrMsg: string
  isValidForm: boolean
  onClickConfirm: (
    callback: (
      challenge: AuthChallengeInfo | undefined,
      errMsg?: string
    ) => void
  ) => Promise<void>
}

const useNewAccount = (): UseNewAccountReturn => {
  const { registerRequest } = useAuth()
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

  const onClickConfirm = async (
    callback: (
      challenge: AuthChallengeInfo | undefined,
      errMsg?: string
    ) => void
  ): Promise<void> => {
    setLoading(true)
    setTimeout(async () => {
      let challenge: AuthChallengeInfo | undefined

      try {
        if (wallet) {
          const res = await registerRequest({
            privateKey: wallet.privateKey,
            password,
          })
          if (!res.success) {
            throw new Error(res.errMsg)
          } else {
            challenge = res.value
          }
        }

        setLoading(false)
        console.log('useNewAccount:challenge', challenge)
        callback(challenge)
      } catch (e) {
        setLoading(false)
        console.error('useNewAccount:authenticateRequest', e)
        callback(undefined, _.toString(e))
      }
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
