import { challengeRequest, challengeVerify } from 'palm-core/api/authChallenge'
import { web3Accounts } from 'palm-core/consts/web3'
import {
  AuthChallengeInfo,
  AuthChallengeResult,
  ContractAddr,
  SupportedNetworkEnum,
} from 'palm-core/types'
import { useState } from 'react'
import { Account } from 'web3-core'

import { useAsyncEffect } from '@sendbird/uikit-utils'

export type UseAuthChallengeReturn = {
  challenge?: AuthChallengeInfo
  verify: () => Promise<AuthChallengeResult | undefined>
}

const useAuthChallenge = (): UseAuthChallengeReturn => {
  const [signer, setSigner] = useState<Account | undefined>()
  const [challenge, setChallenge] = useState<AuthChallengeInfo>()

  useAsyncEffect(async () => {
    const account = await web3Accounts[
      SupportedNetworkEnum.ETHEREUM
    ].getSigner()
    setSigner(account)
    if (!account) {
      return
    }

    const _challenge = await challengeRequest(account.address as ContractAddr)
    setChallenge(_challenge)
  }, [])

  const verify = async (): Promise<AuthChallengeResult | undefined> => {
    if (!signer || !challenge) {
      return
    }
    const signature = signer.sign(challenge.message).signature
    return await challengeVerify(signature, challenge.message)
  }

  return {
    challenge,
    verify,
  }
}

export default useAuthChallenge
