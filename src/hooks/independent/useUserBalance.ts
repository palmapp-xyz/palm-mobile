import useReactQuery from 'hooks/complex/useReactQuery'
import useWeb3 from 'hooks/complex/useWeb3'
import { ContractAddr, pToken, QueryKeyEnum, SupportedNetworkEnum } from 'types'

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
    isLoading,
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
    isLoading,
    isRefetching,
  }
}

export default useUserBalance
