import { Account } from 'web3-core'

import { SupportedNetworkEnum } from 'types'
import { useEffect, useState } from 'react'
import useWeb3 from 'hooks/complex/useWeb3'
import useReactQuery from 'hooks/complex/useReactQuery'

export type UseCreateCompleteReturn = {
  account?: Account
  nonce?: number
}

const useCreateComplete = (): UseCreateCompleteReturn => {
  const { web3, getSigner } = useWeb3(SupportedNetworkEnum.ETHEREUM)

  const [account, setAccount] = useState<Account>()

  const { data: nonce } = useReactQuery(
    ['getTransactionCount', account?.address],
    async () => {
      if (account?.address) {
        return web3?.eth.getTransactionCount(account.address)
      }
    },
    {
      enabled: !!account?.address,
    }
  )

  useEffect(() => {
    getSigner().then(x => {
      setAccount(x)
    })
  }, [])

  return { account, nonce }
}

export default useCreateComplete
