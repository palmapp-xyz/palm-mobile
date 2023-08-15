import _ from 'lodash'
import { recordError } from 'palm-core/libs/logger'
import { AuthChallengeInfo } from 'palm-core/types'
import useAuthChallenge from 'palm-react/hooks/api/useAuthChallenge'
import useAuth from 'palm-react/hooks/auth/useAuth'

import useToast from 'palm-react-native/app/useToast'

export type UseSign4AuthReturn = {
  tryChallenge: () => Promise<void>
  challenge?: AuthChallengeInfo
  signChallenge: () => Promise<void>
}

const useSign4Auth = (): UseSign4AuthReturn => {
  const { appSignIn } = useAuth()
  const { tryChallenge, challenge, verify } = useAuthChallenge()
  const toast = useToast()

  const signChallenge = async (): Promise<void> => {
    try {
      if (challenge) {
        const result = await verify()
        await appSignIn(result!)
      }
    } catch (e) {
      recordError(e, 'signChallenge')
      toast.show(_.toString(e), { icon: 'info', color: 'red' })
      throw e
    } finally {
    }
  }

  return { tryChallenge, challenge, signChallenge }
}

export default useSign4Auth
