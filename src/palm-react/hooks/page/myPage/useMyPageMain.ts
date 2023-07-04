import { Moralis, SupportedNetworkEnum, User } from 'palm-core/types'
import useUserNftCollectionList from 'palm-react/hooks/api/useUserNftCollectionList'
import { UseUserAssetsReturn } from 'palm-react/hooks/api/useUserNftList'
import useAuth from 'palm-react/hooks/auth/useAuth'
import useUserBalance, {
  UseUserBalanceReturn,
} from 'palm-react/hooks/independent/useUserBalance'

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
