import { getUserFtList } from 'palm-core/api/userFtList'
import {
  ApiEnum,
  ContractAddr,
  Moralis,
  SupportedNetworkEnum,
} from 'palm-core/types'
import useReactQuery from 'palm-react/hooks/complex/useReactQuery'

export type UseUserFtListReturn = {
  items: Moralis.FtItem[]
  refetch: () => void
  remove: () => void
  isRefetching: boolean
  status: 'idle' | 'error' | 'loading' | 'success'
}

const useUserFtList = ({
  selectedNetwork,
  userAddress,
}: {
  selectedNetwork: SupportedNetworkEnum
  userAddress?: ContractAddr
}): UseUserFtListReturn => {
  const {
    data: items = [],
    refetch,
    remove,
    isRefetching,
    status,
  } = useReactQuery(
    [ApiEnum.TOKENS, userAddress, selectedNetwork],
    async () => {
      if (userAddress) {
        return await getUserFtList({
          selectedNetwork,
          userAddress,
        })
      }
      return [] as Moralis.FtItem[]
    },
    {
      enabled: !!userAddress,
    }
  )

  return {
    items,
    refetch,
    remove,
    isRefetching,
    status,
  }
}

export default useUserFtList
