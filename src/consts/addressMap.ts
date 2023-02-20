import { ChainNetworkEnum, ContractAddr, ContractMap } from 'types'

const contractMap: Record<ChainNetworkEnum, ContractMap> = {
  [ChainNetworkEnum.ETHEREUM]: {
    escrow: '' as ContractAddr,
  },
  [ChainNetworkEnum.GOERLI]: {
    escrow: '0x43692EE081A8823F22D476052BB80DF29C3AA1ED' as ContractAddr,
  },
}

export default { contractMap }
