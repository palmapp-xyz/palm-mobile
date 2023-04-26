import { useState } from 'react'

import useAuth from 'hooks/auth/useAuth'
import { AuthChallengeInfo } from 'types'
import { useSetRecoilState } from 'recoil'
import appStore from 'store/appStore'

export type UseAuthLoginReturn = {
  password: string
  setPassword: (value: string) => void
  isValidForm: boolean
  onClickConfirm: (
    callback: (
      challenge: AuthChallengeInfo | undefined,
      errMsg?: string
    ) => void
  ) => Promise<void>
}

const useAuthLogin = (): UseAuthLoginReturn => {
  const { authenticateRequest } = useAuth()
  const [password, setPassword] = useState('')
  const setLoading = useSetRecoilState(appStore.loading)

  const isValidForm = !!password

  const onClickConfirm = async (
    callback: (
      challenge: AuthChallengeInfo | undefined,
      errMsg?: string
    ) => void
  ): Promise<void> => {
    setLoading(true)
    setTimeout(async () => {
      const res = await authenticateRequest({ password })
      if (res.success === false) {
        setLoading(false)
        console.error('useAuthLogin:authenticateRequest', res.errMsg)
        callback(undefined, res.errMsg)
      } else {
        setLoading(false)
        console.log('useAuthLogin:challenge', res.value)
        callback(res.value)
      }
    }, 500)
  }

  return {
    password,
    setPassword,
    isValidForm,
    onClickConfirm,
  }
}

export default useAuthLogin
