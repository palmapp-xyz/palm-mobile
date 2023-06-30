import { Moralis, SupportedNetworkEnum, User } from 'core/types'
import useUserNftCollectionList from 'hooks/api/useUserNftCollectionList'
import { UseUserAssetsReturn } from 'hooks/api/useUserNftList'
import useAuth from 'hooks/auth/useAuth'
import useUserBalance, {
  UseUserBalanceReturn,
} from 'hooks/independent/useUserBalance'

export type UseMyPageMainReturn = {
  user?: User
  useMyBalanceReturn: UseUserBalanceReturn
  useMyNftCollectionReturn: UseUserAssetsReturn<Moralis.NftCollection>
}

const useMyPageMain = ({
  selectedNetwork,
}: {
  selectedNetwork: SupportedNetworkEnum
}): UseMyPageMainReturn => {
  const { user } = useAuth()

  const useMyNftCollectionReturn = useUserNftCollectionList({
    userAddress: user?.address,
    selectedNetwork,
  })

  const useMyBalanceReturn = useUserBalance({
    address: user?.address,
    chain: selectedNetwork,
  })

  return { user, useMyBalanceReturn, useMyNftCollectionReturn }
}

export default useMyPageMain
