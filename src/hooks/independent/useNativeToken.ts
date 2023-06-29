import axios from 'axios'
import { UTIL } from 'core/consts'
import useNetwork from 'hooks/complex/useNetwork'
import useWeb3 from 'hooks/complex/useWeb3'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import {
  ContractAddr,
  Moralis,
  pToken,
  QueryKeyEnum,
  SupportedNetworkEnum,
  Token,
} from 'types'

export type UseNativeTokenReturn = {
  nativeToken: Moralis.FtItem | undefined
  getNativeToken: (balance: pToken) => Moralis.FtItem
}

const useNativeToken = ({
  userAddress,
  network,
}: {
  userAddress?: ContractAddr
  network: SupportedNetworkEnum
}): UseNativeTokenReturn => {
  const { connectedNetworkIds, connectedNetworkParams } = useNetwork()
  const connectedNetworkId = connectedNetworkIds[network]

  const apiPath = useMemo(() => {
    const chain =
      network === SupportedNetworkEnum.ETHEREUM
        ? 'ethereum'
        : network === SupportedNetworkEnum.POLYGON
        ? 'matic-network'
        : network === SupportedNetworkEnum.KLAYTN
        ? 'klay-token'
        : undefined
    return `https://api.coingecko.com/api/v3/coins/${chain}/market_chart?vs_currency=usd&days=0.1`
  }, [network])

  const { data: price = 0 } = useQuery(
    [QueryKeyEnum.NATIVE_TOKEN_PRICE, network],
    async () => {
      const res = await axios.get<{ prices: [number, number][] }>(apiPath)
      const lastItem = res.data.prices.pop()
      if (lastItem) {
        return lastItem[1]
      }
    },
    {
      keepPreviousData: true,
      refetchOnWindowFocus: true,
    }
  )

  const { web3 } = useWeb3(network)
  const { data: balance = '0' } = useQuery(
    [QueryKeyEnum.NATIVE_TOKEN_BALANCE, userAddress, network],
    async () => {
      if (userAddress) {
        return await web3.eth.getBalance(userAddress)
      }
    },
    {
      enabled: !!userAddress,
    }
  )

  const getNativeToken = (_balance: pToken): Moralis.FtItem => ({
    token_address: '0x0' as ContractAddr,
    ...connectedNetworkParams[network].nativeCurrency,
    balance: _balance,
    chainId: connectedNetworkId,
    price: {
      tokenName: connectedNetworkParams[network].nativeCurrency.name,
      tokenSymbol: connectedNetworkParams[network].nativeCurrency.symbol,
      tokenLogo: connectedNetworkParams[network].nativeCurrency.logo.source,
      tokenDecimals: String(
        connectedNetworkParams[network].nativeCurrency.decimals
      ),
      nativePrice: {
        value: UTIL.microfyP('1' as Token),
        decimals: connectedNetworkParams[network].nativeCurrency.decimals,
        name: connectedNetworkParams[network].nativeCurrency.name,
        symbol: connectedNetworkParams[network].nativeCurrency.symbol,
      },
      usdPrice: price,
      exchangeAddress: '0x0' as ContractAddr,
      exchangeName: '',
      tokenAddress: '0x0' as ContractAddr,
    } as Moralis.TokenPrice,
    thumbnail: null,
  })

  const nativeToken = useMemo(
    () => (balance ? getNativeToken(balance as pToken) : undefined),
    [userAddress, network, balance, price]
  )

  return { nativeToken, getNativeToken }
}

export default useNativeToken
