import useUserNftList, { UseUserNftListReturn } from 'hooks/api/useUserNftList'
import useAuth from 'hooks/auth/useAuth'
import useUserBalance, {
  UseUserBalanceReturn,
} from 'hooks/independent/useUserBalance'
import { SupportedNetworkEnum, User } from 'types'

export type UseMyPageMainReturn = {
  user?: User
  useMyBalanceReturn: UseUserBalanceReturn
  useMyNftListReturn: UseUserNftListReturn
}

const useMyPageMain = ({
  selectedNetwork,
}: {
  selectedNetwork: SupportedNetworkEnum
}): UseMyPageMainReturn => {
  const { user } = useAuth()

  const useMyNftListReturn = useUserNftList({
    userAddress: user?.address,
    selectedNetwork,
  })

  const useMyBalanceReturn = useUserBalance({
    address: user?.address,
    chain: selectedNetwork,
  })

  return { user, useMyBalanceReturn, useMyNftListReturn }
}

export default useMyPageMain
