import useReactQuery from 'hooks/complex/useReactQuery'
import useWeb3 from 'hooks/complex/useWeb3'
import { ContractAddr, pToken, QueryKeyEnum, SupportedNetworkEnum } from 'types'

export type UseUserBalanceReturn = {
  ethBalance: pToken
  refetch: () => void
}

const useUserBalance = ({
  address,
  chain,
}: {
  address?: ContractAddr
  chain: SupportedNetworkEnum
}): UseUserBalanceReturn => {
  const { web3 } = useWeb3(chain)
  const { data: ethBalance = '0', refetch: refetchEth } = useReactQuery(
    [QueryKeyEnum.ETH_BALANCE, address, chain],
    async () => {
      if (address) {
        return web3.eth.getBalance(address)
      }
    },
    {
      enabled: !!address,
    }
  )

  const refetch = async (): Promise<void> => {
    await Promise.all([refetchEth()])
  }

  return {
    ethBalance: ethBalance as pToken,
    refetch,
  }
}

export default useUserBalance
