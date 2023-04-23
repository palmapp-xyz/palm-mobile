import { toHex } from 'web3-utils'

import {
  AddEthereumChainParameter,
  ChainNetworkEnum,
  NetworkTypeEnum,
  SupportedNetworkEnum,
  TokenSymbolEnum,
} from 'types'
import Config from 'react-native-config'
import images from 'assets/images'

const chainId: Record<ChainNetworkEnum, number> = {
  [ChainNetworkEnum.ETHEREUM]: 1,
  [ChainNetworkEnum.GOERLI]: 5,
  [ChainNetworkEnum.CYPRESS]: 8217,
  [ChainNetworkEnum.BAOBAB]: 1001,
  [ChainNetworkEnum.POLYGON]: 137,
  [ChainNetworkEnum.MUMBAI]: 80001,
}

const chainIds: Record<
  NetworkTypeEnum,
  Record<SupportedNetworkEnum, number>
> = {
  [NetworkTypeEnum.MAINNET]: {
    [SupportedNetworkEnum.ETHEREUM]: chainId[ChainNetworkEnum.ETHEREUM],
    [SupportedNetworkEnum.KLAYTN]: chainId[ChainNetworkEnum.CYPRESS],
    [SupportedNetworkEnum.POLYGON]: chainId[ChainNetworkEnum.POLYGON],
  },
  [NetworkTypeEnum.TESTNET]: {
    [SupportedNetworkEnum.ETHEREUM]: chainId[ChainNetworkEnum.GOERLI],
    [SupportedNetworkEnum.KLAYTN]: chainId[ChainNetworkEnum.BAOBAB],
    [SupportedNetworkEnum.POLYGON]: chainId[ChainNetworkEnum.MUMBAI],
  },
}

const chainParam: Record<ChainNetworkEnum, AddEthereumChainParameter> = {
  [ChainNetworkEnum.ETHEREUM]: {
    chainId: toHex(chainId[ChainNetworkEnum.ETHEREUM]),
    chainName: 'Mainnet',
    rpcUrls: [
      Config.ALCHEMY_API_KEY_ETHEREUM
        ? `https://eth-mainnet.g.alchemy.com/v2/${Config.ALCHEMY_API_KEY_ETHEREUM}`
        : 'https://ethereum.publicnode.com',
    ],
    nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' },
    blockExplorerUrls: ['https://etherscan.io'],
  },
  [ChainNetworkEnum.GOERLI]: {
    chainId: toHex(chainId[ChainNetworkEnum.GOERLI]),
    chainName: 'Goerli',
    rpcUrls: [
      Config.ALCHEMY_API_KEY_GOERLI
        ? `https://eth-goerli.g.alchemy.com/v2/${Config.ALCHEMY_API_KEY_GOERLI}`
        : 'https://ethereum-goerli-rpc.allthatnode.com',
    ],
    nativeCurrency: {
      name: 'Goerli ETH',
      symbol: 'gorETH',
      decimals: 18,
    },
    blockExplorerUrls: ['https://goerli.etherscan.io'],
  },
  [ChainNetworkEnum.CYPRESS]: {
    chainId: toHex(chainId[ChainNetworkEnum.CYPRESS]),
    chainName: 'Klaytn Cypress',
    rpcUrls: ['https://public-node-api.klaytnapi.com/v1/cypress'],
    nativeCurrency: { name: 'Klay', decimals: 18, symbol: 'KLAY' },
    blockExplorerUrls: ['https://scope.klaytn.com'],
  },
  [ChainNetworkEnum.BAOBAB]: {
    chainId: toHex(chainId[ChainNetworkEnum.BAOBAB]),
    chainName: 'Klaytn Baobab',
    rpcUrls: ['https://api.baobab.klaytn.net:8651'],
    nativeCurrency: { name: 'Klay', decimals: 18, symbol: 'KLAY' },
    blockExplorerUrls: ['https://baobab.scope.klaytn.com'],
  },
  [ChainNetworkEnum.POLYGON]: {
    chainId: toHex(chainId[ChainNetworkEnum.POLYGON]),
    chainName: 'Polygon Mainnet',
    rpcUrls: [
      Config.ALCHEMY_API_KEY_POLYGON
        ? `https://polygon-mainnet.g.alchemy.com/v2/${Config.ALCHEMY_API_KEY_POLYGON}`
        : 'https://polygon.blockpi.network/v1/rpc/public',
    ],
    nativeCurrency: { name: 'Matic', decimals: 18, symbol: 'MATIC' },
    blockExplorerUrls: ['https://polygonscan.com'],
  },
  [ChainNetworkEnum.MUMBAI]: {
    chainId: toHex(chainId[ChainNetworkEnum.MUMBAI]),
    chainName: 'Polygon Mumbai',
    rpcUrls: [
      Config.ALCHEMY_API_KEY_MUMBAI
        ? `https://polygon-mumbai.g.alchemy.com/v2/${Config.ALCHEMY_API_KEY_MUMBAI}`
        : 'https://polygon-mumbai.blockpi.network/v1/rpc/public',
    ],
    nativeCurrency: { name: 'Matic', decimals: 18, symbol: 'MATIC' },
    blockExplorerUrls: ['https://mumbai.polygonscan.com'],
  },
}

const chainParams: Record<
  NetworkTypeEnum,
  Record<SupportedNetworkEnum, AddEthereumChainParameter>
> = {
  [NetworkTypeEnum.MAINNET]: {
    [SupportedNetworkEnum.ETHEREUM]: chainParam[ChainNetworkEnum.ETHEREUM],
    [SupportedNetworkEnum.KLAYTN]: chainParam[ChainNetworkEnum.CYPRESS],
    [SupportedNetworkEnum.POLYGON]: chainParam[ChainNetworkEnum.POLYGON],
  },
  [NetworkTypeEnum.TESTNET]: {
    [SupportedNetworkEnum.ETHEREUM]: chainParam[ChainNetworkEnum.GOERLI],
    [SupportedNetworkEnum.KLAYTN]: chainParam[ChainNetworkEnum.BAOBAB],
    [SupportedNetworkEnum.POLYGON]: chainParam[ChainNetworkEnum.MUMBAI],
  },
}

const getNetworkLogo = (chain: SupportedNetworkEnum): any => {
  return chain === SupportedNetworkEnum.POLYGON
    ? images.matic_logo
    : chain === SupportedNetworkEnum.KLAYTN
    ? images.klay_logo
    : images.eth_logo
}

const nativeToken = {
  [SupportedNetworkEnum.ETHEREUM]: TokenSymbolEnum.ETH,
  [SupportedNetworkEnum.KLAYTN]: TokenSymbolEnum.KLAY,
  [SupportedNetworkEnum.POLYGON]: TokenSymbolEnum.MATIC,
}

export default {
  chainId,
  chainParam,
  chainIds,
  chainParams,
  getNetworkLogo,
  nativeToken,
}
