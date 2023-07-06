import Web3Account from 'palm-core/complex/web3'
import { SupportedNetworkEnum } from 'palm-core/types'

export const web3Accounts = {
  [SupportedNetworkEnum.ETHEREUM]: new Web3Account(
    SupportedNetworkEnum.ETHEREUM
  ),
  [SupportedNetworkEnum.POLYGON]: new Web3Account(SupportedNetworkEnum.POLYGON),
  [SupportedNetworkEnum.KLAYTN]: new Web3Account(SupportedNetworkEnum.KLAYTN),
}
