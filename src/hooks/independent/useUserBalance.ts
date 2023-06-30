import {
  ContractAddr,
  pToken,
  QueryKeyEnum,
  SupportedNetworkEnum,
} from 'core/types'
import useReactQuery from 'hooks/complex/useReactQuery'
import useWeb3 from 'hooks/complex/useWeb3'

export type UseUserBalanceReturn = {
  balance: pToken
  refetch: () => void
  remove: () => void
  isLoading: boolean
  isRefetching: boolean
}

const useUserBalance = ({
  address,
  chain,
}: {
  address?: ContractAddr
  chain: SupportedNetworkEnum
}): UseUserBalanceReturn => {
  const { web3 } = useWeb3(chain)
  const {
    data: balance = '0',
    refetch,
    remove,
    status,
    isRefetching,
  } = useReactQuery(
    [QueryKeyEnum.NATIVE_TOKEN_BALANCE, address, chain],
    async () => {
      if (address) {
        return web3.eth.getBalance(address)
      }
    },
    {
      enabled: !!address,
    }
  )

  return {
    balance: balance as pToken,
    refetch,
    remove,
    isLoading: status === 'loading',
    isRefetching,
  }
}

export default useUserBalance
