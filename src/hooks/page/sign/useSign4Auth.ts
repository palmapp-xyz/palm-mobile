import useAuthChallenge from 'hooks/api/useAuthChallenge'
import useAuth from 'hooks/auth/useAuth'
import useWeb3 from 'hooks/complex/useWeb3'
import { recordError } from 'libs/logger'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import appStore from 'store/appStore'
import { AuthChallengeInfo, ContractAddr, SupportedNetworkEnum } from 'types'
import { Account } from 'web3-core'

import { useAlert } from '@sendbird/uikit-react-native-foundation'
import { useTranslation } from 'react-i18next'

export type UseSign4AuthReturn = {
  challenge?: AuthChallengeInfo
  signChallenge: () => Promise<void>
}

const useSign4Auth = (): UseSign4AuthReturn => {
  const { appSignIn } = useAuth()
  const setLoading = useSetRecoilState(appStore.loading)
  const { getSigner } = useWeb3(SupportedNetworkEnum.ETHEREUM)
  const [challenge, setChallenge] = useState<AuthChallengeInfo>()
  const [signer, setSigner] = useState<Account>()
  const { challengeRequest, challengeVerify } = useAuthChallenge(
    SupportedNetworkEnum.ETHEREUM
  )
  const { alert } = useAlert()
  const { t } = useTranslation()

  const signChallenge = async (): Promise<void> => {
    setLoading(true)
    if (challenge && signer) {
      try {
        const signature = signer.sign(challenge.message).signature

        const result = await challengeVerify(signature, challenge.message)
        await appSignIn(result)
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

  const _getChallenge = async (): Promise<void> => {
    const _account = await getSigner()
    setSigner(_account)
    const _challenge = await challengeRequest(_account?.address as ContractAddr)
    setChallenge(_challenge)
    setLoading(false)
  }

  useEffect(() => {
    _getChallenge()
  }, [])

  return { challenge, signChallenge }
}

export default useSign4Auth
