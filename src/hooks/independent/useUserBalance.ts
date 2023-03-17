import useReactQuery from 'hooks/complex/useReactQuery'
import useWeb3 from 'hooks/complex/useWeb3'
import { ContractAddr, pToken, QueryKeyEnum } from 'types'

export type UseUserBalanceReturn = {
  ethBalance: pToken
  klayBalance: pToken
  refetch: () => void
}

const useUserBalance = ({
  address,
}: {
  address?: ContractAddr
}): UseUserBalanceReturn => {
  const { web3Eth, web3Klaytn } = useWeb3()
  const { data: ethBalance = '0', refetch: refetchEth } = useReactQuery(
    [QueryKeyEnum.ETH_BALANCE, address],
    async () => {
      if (address) {
        return web3Eth.eth.getBalance(address)
      }
    },
    {
      enabled: !!address,
    }
  )
  const { data: klayBalance = '0', refetch: refetchKlay } = useReactQuery(
    [QueryKeyEnum.KLAY_BALANCE, address],
    async () => {
      if (address) {
        return web3Klaytn.eth.getBalance(address)
      }
    },
    {
      enabled: !!address,
    }
  )

  const refetch = async (): Promise<void> => {
    await Promise.all([refetchEth(), refetchKlay()])
  }

  return {
    ethBalance: ethBalance as pToken,
    klayBalance: klayBalance as pToken,
    refetch,
  }
}

export default useUserBalance
