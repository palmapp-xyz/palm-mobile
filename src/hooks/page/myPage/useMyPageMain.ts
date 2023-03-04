import { pToken, User } from 'types'

import useUserNftList, { UseUserNftListReturn } from 'hooks/api/useUserNftList'
import useAuth from 'hooks/independent/useAuth'
import useUserBalance from 'hooks/independent/useUserBalance'

export type UseMyPageMainReturn = {
  user?: User
  balance: pToken
  useMyNftListReturn: UseUserNftListReturn
}

const useMyPageMain = (): UseMyPageMainReturn => {
  const { user } = useAuth()

  const useMyNftListReturn = useUserNftList({
    userAddress: user?.address,
  })

  const { balance } = useUserBalance({ address: user?.address })

  return { user, balance, useMyNftListReturn }
}

export default useMyPageMain
