import useReactQuery from 'hooks/complex/useReactQuery'
import useWeb3 from 'hooks/complex/useWeb3'
import { ContractAddr, pToken, QueryKeyEnum } from 'types'

export type UseUserBalanceReturn = {
  balance: pToken
  refetch: () => void
}

const useUserBalance = ({
  address,
}: {
  address?: ContractAddr
}): UseUserBalanceReturn => {
  const { web3 } = useWeb3()
  const { data = '0', refetch } = useReactQuery(
    [QueryKeyEnum.ETH_BALANCE, address],
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
    balance: data as pToken,
    refetch,
  }
}

export default useUserBalance
