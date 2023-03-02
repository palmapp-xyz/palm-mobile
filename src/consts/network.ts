import { toHex } from 'web3-utils'

import { AddEthereumChainParameter, ChainNetworkEnum } from 'types'
import Config from 'react-native-config'

const chainId: Record<ChainNetworkEnum, number> = {
  [ChainNetworkEnum.ETHEREUM]: 0x1,
  [ChainNetworkEnum.GOERLI]: 0x5,
}

const chainParam: Record<ChainNetworkEnum, AddEthereumChainParameter> = {
  [ChainNetworkEnum.ETHEREUM]: {
    chainId: toHex(chainId[ChainNetworkEnum.ETHEREUM]),
    chainName: 'Mainnet',
    rpcUrls: [
      Config.ALCHEMY_API_KEY
        ? `https://eth-mainnet.g.alchemy.com/v2/${Config.ALCHEMY_API_KEY}`
        : 'https://ethereum.publicnode.com',
    ],
    nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' },
    blockExplorerUrls: ['https://etherscan.io'],
  },
  [ChainNetworkEnum.GOERLI]: {
    chainId: toHex(chainId[ChainNetworkEnum.GOERLI]),
    chainName: 'Goerli',
    rpcUrls: [
      Config.ALCHEMY_API_KEY
        ? `https://eth-goerli.g.alchemy.com/v2/${Config.ALCHEMY_API_KEY}`
        : 'https://ethereum-goerli-rpc.allthatnode.com',
    ],
    nativeCurrency: {
      name: 'Goerli ETH',
      symbol: 'gorETH',
      decimals: 18,
    },
    blockExplorerUrls: ['https://goerli.etherscan.io'],
  },
}

export default {
  chainId,
  chainParam,
}
