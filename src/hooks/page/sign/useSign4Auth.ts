import useAuthChallenge from 'hooks/api/useAuthChallenge'
import useAuth from 'hooks/auth/useAuth'
import useWeb3 from 'hooks/complex/useWeb3'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { useSetRecoilState } from 'recoil'
import { Account } from 'web3-core'

import appStore from 'store/appStore'
import { AuthChallengeInfo, ContractAddr, SupportedNetworkEnum } from 'types'

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

  const signChallenge = async (): Promise<void> => {
    setLoading(true)
    if (challenge && signer) {
      try {
        const signature = signer.sign(challenge.message).signature

        const result = await challengeVerify(signature, challenge.message)
        await appSignIn(result)
      } catch (e) {
        console.error(e)
        Alert.alert(_.toString(e))
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
