import axios from 'axios'
import { UTIL } from 'palm-core/libs'
import { chainId, chainParam } from 'palm-core/libs/network'
import {
  ContractAddr,
  Moralis,
  pToken,
  QueryKeyEnum,
  SupportedNetworkEnum,
  Token,
} from 'palm-core/types'
import useWeb3 from 'palm-react/hooks/complex/useWeb3'
import { useMemo } from 'react'
import { useQuery } from 'react-query'

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
  const connectedNetworkId = chainId(network)
  const connectedNetworkParam = chainParam(network)

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
    ...connectedNetworkParam.nativeCurrency,
    balance: _balance,
    chainId: connectedNetworkId,
    price: {
      tokenName: connectedNetworkParam.nativeCurrency.name,
      tokenSymbol: connectedNetworkParam.nativeCurrency.symbol,
      tokenLogo: connectedNetworkParam.nativeCurrency.logo.source,
      tokenDecimals: String(connectedNetworkParam.nativeCurrency.decimals),
      nativePrice: {
        value: UTIL.microfyP('1' as Token),
        decimals: connectedNetworkParam.nativeCurrency.decimals,
        name: connectedNetworkParam.nativeCurrency.name,
        symbol: connectedNetworkParam.nativeCurrency.symbol,
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
