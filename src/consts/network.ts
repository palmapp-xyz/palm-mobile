import { toHex } from 'web3-utils'

import { AddEthereumChainParameter, ChainNetworkEnum } from 'types'
import Config from 'react-native-config'

const chainId: Record<ChainNetworkEnum, number> = {
  [ChainNetworkEnum.ETHEREUM]: 1,
  [ChainNetworkEnum.GOERLI]: 5,
  [ChainNetworkEnum.CYPRESS]: 8217,
  [ChainNetworkEnum.BAOBAB]: 1001,
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
    nativeCurrency: { name: 'Klaytn Token', decimals: 18, symbol: 'KLAY' },
    blockExplorerUrls: ['https://scope.klaytn.com'],
  },
  [ChainNetworkEnum.BAOBAB]: {
    chainId: toHex(chainId[ChainNetworkEnum.BAOBAB]),
    chainName: 'Klaytn Baobab',
    rpcUrls: ['https://api.baobab.klaytn.net:8651'],
    nativeCurrency: { name: 'Klaytn Token', decimals: 18, symbol: 'KLAY' },
    blockExplorerUrls: ['https://baobab.scope.klaytn.com/'],
  },
}

export default {
  chainId,
  chainParam,
}
