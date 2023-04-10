import { useAsyncEffect } from '@sendbird/uikit-utils'

import useNetwork from 'hooks/complex/useNetwork'
import useWeb3 from 'hooks/complex/useWeb3'
import useAuth from 'hooks/independent/useAuth'
import { getPkey } from 'libs/account'
import _ from 'lodash'
import { useState } from 'react'
import { Alert } from 'react-native'
import { AuthChallengeInfo, SupportedNetworkEnum } from 'types'

export type UseSign4AuthReturn = {
  challenge: AuthChallengeInfo | undefined
  onPress: () => Promise<void>
}

const useSign4Auth = (chain: SupportedNetworkEnum): UseSign4AuthReturn => {
  const { user, setAuth, challengeRequest, challengeVerify } = useAuth()
  const { connectedNetworkIds } = useNetwork()
  const connectedNetworkId = connectedNetworkIds[SupportedNetworkEnum.ETHEREUM]

  const { web3 } = useWeb3(chain)

  const [challenge, setChallenge] = useState<AuthChallengeInfo>()

  useAsyncEffect(async () => {
    if (!user?.address) {
      return
    }

    try {
      const requestInfo = await challengeRequest(user?.address)
      setChallenge(requestInfo)
    } catch (e) {
      console.error(e)
      Alert.alert('Unknown Error', _.toString(e))
    }
  }, [user?.address, connectedNetworkId])

  const onPress = async (): Promise<void> => {
    if (!challenge) {
      return
    }

    try {
      const pKey = await getPkey()
      const account = web3.eth.accounts.privateKeyToAccount(pKey)
      const signature = account.sign(challenge.message).signature

      const result = await challengeVerify(signature, challenge.message)
      setAuth(result)
    } catch (e) {
      console.error(e)
      Alert.alert('Unknown Error', _.toString(e))
    }
  }

  return { challenge, onPress }
}

export default useSign4Auth
