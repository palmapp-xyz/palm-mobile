import useAuth from 'hooks/independent/useAuth'
import _ from 'lodash'
import { useSetRecoilState } from 'recoil'
import appStore from 'store/appStore'
import { AuthChallengeInfo, SupportedNetworkEnum } from 'types'

export type UseSign4AuthReturn = {
  signChallenge: (
    challenge: AuthChallengeInfo,
    onError: (errMsg: string) => void
  ) => Promise<void>
}

const useSign4Auth = (chain: SupportedNetworkEnum): UseSign4AuthReturn => {
  const { user, authenticate, setAuth } = useAuth(chain)
  const setLoading = useSetRecoilState(appStore.loading)

  const signChallenge = async (
    challenge: AuthChallengeInfo,
    onError: (errMsg: string) => void
  ): Promise<void> => {
    setLoading(true)
    setTimeout(async () => {
      try {
        const result = await authenticate({ challenge })
        if (result.success) {
          console.log('useSign4Auth:signChallenge result', result.value)
          await setAuth(user!, result.value)
          setLoading(false)
        } else {
          throw new Error(result.errMsg)
        }
      } catch (e) {
        setLoading(false)
        console.error(e)
        onError(_.toString(e))
      }
    }, 500)
  }

  return { signChallenge }
}

export default useSign4Auth
