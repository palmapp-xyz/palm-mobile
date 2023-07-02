import axios from 'axios'
import Web3Account from 'palm-core/complex/web3'
import { UTIL } from 'palm-core/libs'
import { chainId, chainParam } from 'palm-core/libs/network'
import {
  ContractAddr,
  Moralis,
  pToken,
  SupportedNetworkEnum,
  Token,
} from 'palm-core/types'

export const getNativeTokenPrice = async (
  network: SupportedNetworkEnum
): Promise<number | undefined> => {
  const chain =
    network === SupportedNetworkEnum.ETHEREUM
      ? 'ethereum'
      : network === SupportedNetworkEnum.POLYGON
      ? 'matic-network'
      : network === SupportedNetworkEnum.KLAYTN
      ? 'klay-token'
      : undefined

  const apiPath = `https://api.coingecko.com/api/v3/coins/${chain}/market_chart?vs_currency=usd&days=0.1`

  const res = await axios.get<{ prices: [number, number][] }>(apiPath)
  const lastItem = res.data.prices.pop()
  return lastItem ? lastItem[1] ?? lastItem[0] : undefined
}

export const getNativeTokenWithBalance = async (
  network: SupportedNetworkEnum,
  balance: pToken
): Promise<Moralis.FtItem> => {
  const usdPrice = (await getNativeTokenPrice(network)) ?? 0
  return {
    token_address: '0x0' as ContractAddr,
    ...chainParam(network).nativeCurrency,
    balance,
    chainId: chainId(network),
    price: {
      tokenName: chainParam(network).nativeCurrency.name,
      tokenSymbol: chainParam(network).nativeCurrency.symbol,
      tokenLogo: chainParam(network).nativeCurrency.logo.source,
      tokenDecimals: String(chainParam(network).nativeCurrency.decimals),
      nativePrice: {
        value: UTIL.microfyP('1' as Token),
        decimals: chainParam(network).nativeCurrency.decimals,
        name: chainParam(network).nativeCurrency.name,
        symbol: chainParam(network).nativeCurrency.symbol,
      },
      usdPrice,
      exchangeAddress: '0x0' as ContractAddr,
      exchangeName: '',
      tokenAddress: '0x0' as ContractAddr,
    } as Moralis.TokenPrice,
    thumbnail: null,
  } as Moralis.FtItem
}

export const getUserNativeTokenBalance = async (
  userAddress: ContractAddr,
  network: SupportedNetworkEnum
): Promise<Moralis.FtItem> => {
  const web3Account = new Web3Account(network)
  const balance = await web3Account.getBalance(userAddress)
  return await getNativeTokenWithBalance(network, balance as pToken)
}
