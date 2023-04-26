import { useMemo, useState } from 'react'
import { validateMnemonic } from 'bip39'

import useAuth from 'hooks/auth/useAuth'
import { generateEvmHdAccount } from 'libs/account'
import { useSetRecoilState } from 'recoil'
import appStore from 'store/appStore'
import { AuthChallengeInfo } from 'types'
import _ from 'lodash'

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
  onClickConfirm: (
    callback: (
      challenge: AuthChallengeInfo | undefined,
      errMsg?: string
    ) => void
  ) => Promise<void>
}

const useRecoverAccount = (): UseRecoverAccountReturn => {
  const { registerRequest } = useAuth()
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

  const setLoading = useSetRecoilState(appStore.loading)

  const isValidForm = !!password && !passwordConfirmErrMsg && !mnemonicErrMsg

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
        if (usePkey) {
          const res = await registerRequest({ privateKey, password })
          if (!res.success) {
            throw new Error(res.errMsg)
          } else {
            challenge = res.value
          }
        } else {
          await generateEvmHdAccount(mnemonic).then(
            async (account): Promise<void> => {
              const res = await registerRequest({
                privateKey: account.privateKey,
                password,
              })
              if (!res.success) {
                throw new Error(res.errMsg)
              } else {
                challenge = res.value
              }
            }
          )
        }

        setLoading(false)
        console.log('useRecoverAccount:challenge', challenge)
        callback(challenge)
      } catch (e) {
        setLoading(false)
        console.error('useRecoverAccount:authenticateRequest', e)
        callback(undefined, _.toString(e))
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
  }
}

export default useRecoverAccount
