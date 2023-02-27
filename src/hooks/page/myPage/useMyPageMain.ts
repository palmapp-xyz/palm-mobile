import { pToken, User } from 'types'

import useUserNftList, { UseUserNftListReturn } from 'hooks/api/useUserNftList'
import useAuth from 'hooks/independent/useAuth'
import useReactQuery from 'hooks/complex/useReactQuery'
import useWeb3 from 'hooks/complex/useWeb3'

export type UseMyPageMainReturn = {
  user?: User
  balance: pToken
  useMyNftListReturn: UseUserNftListReturn
}

const useMyPageMain = (): UseMyPageMainReturn => {
  const { user } = useAuth()
  const { web3 } = useWeb3()

  const useMyNftListReturn = useUserNftList({
    userAddress: user?.address,
  })
  const { data = '0' } = useReactQuery(
    ['getBalance'],
    async () => {
      if (user) {
        return web3.eth.getBalance(user?.address)
      }
    },
    {
      enabled: !!user?.address,
    }
  )
  return { user, balance: data as pToken, useMyNftListReturn }
}

export default useMyPageMain
