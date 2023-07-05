import _ from 'lodash'
import { recordError } from 'palm-core/libs/logger'
import { AuthChallengeInfo } from 'palm-core/types'
import useAuthChallenge from 'palm-react/hooks/api/useAuthChallenge'
import useAuth from 'palm-react/hooks/auth/useAuth'
import appStore from 'palm-react/store/appStore'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSetRecoilState } from 'recoil'

import { useAlert } from '@sendbird/uikit-react-native-foundation'

export type UseSign4AuthReturn = {
  challenge?: AuthChallengeInfo
  signChallenge: () => Promise<void>
}

const useSign4Auth = (): UseSign4AuthReturn => {
  const { appSignIn } = useAuth()
  const setLoading = useSetRecoilState(appStore.loading)
  const { challenge, verify } = useAuthChallenge()
  const { alert } = useAlert()
  const { t } = useTranslation()

  const signChallenge = async (): Promise<void> => {
    setLoading(true)
    if (challenge) {
      try {
        const result = await verify()
        await appSignIn(result!)
      } catch (e) {
        recordError(e, 'signChallenge')
        alert({
          title: t('Auth.Sign4AuthFailureAlertTitle'),
          message: _.toString(e),
        })
      } finally {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    setLoading(!challenge)
  }, [challenge])

  return { challenge, signChallenge }
}

export default useSign4Auth
