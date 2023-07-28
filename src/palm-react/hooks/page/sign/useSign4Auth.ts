import _ from 'lodash'
import { recordError } from 'palm-core/libs/logger'
import { AuthChallengeInfo } from 'palm-core/types'
import useAuthChallenge from 'palm-react/hooks/api/useAuthChallenge'
import useAuth from 'palm-react/hooks/auth/useAuth'
import appStore from 'palm-react/store/appStore'
import { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'

import useToast from 'palm-react-native/app/useToast'

export type UseSign4AuthReturn = {
  challenge?: AuthChallengeInfo
  signChallenge: () => Promise<void>
}

const useSign4Auth = (): UseSign4AuthReturn => {
  const { appSignIn } = useAuth()
  const setLoading = useSetRecoilState(appStore.loading)
  const { challenge, verify } = useAuthChallenge()
  const toast = useToast()

  const signChallenge = async (): Promise<void> => {
    setLoading(true)
    try {
      if (challenge) {
        const result = await verify()
        await appSignIn(result!)
      }
    } catch (e) {
      recordError(e, 'signChallenge')
      toast.show(_.toString(e), { icon: 'info', color: 'red' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(!challenge)
  }, [challenge])

  return { challenge, signChallenge }
}

export default useSign4Auth
