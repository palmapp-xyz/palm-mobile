import { Moralis, pToken, User } from 'types'

import useUserNftList from 'hooks/api/useUserNftList'
import useAuth from 'hooks/independent/useAuth'
import useReactQuery from 'hooks/complex/useReactQuery'
import useWeb3 from 'hooks/complex/useWeb3'

export type UseMyPageMainReturn = {
  user?: User
  nftList: Moralis.NftItem[]
  balance: pToken
}

const useMyPageMain = (): UseMyPageMainReturn => {
  const { user } = useAuth()
  const { web3 } = useWeb3()

  const { nftList } = useUserNftList({
    userAddress: user?.address,
  })

  const { data = '0' } = useReactQuery(
    ['getBalance'],
    async () => {
      if (user) {
        return web3.eth.getBalance(user?.address)
      }
    },
    {
      enabled: !!user?.address,
    }
  )
  return { user, nftList, balance: data as pToken }
}

export default useMyPageMain
