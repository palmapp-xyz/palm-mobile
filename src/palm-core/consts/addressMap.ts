import {
  ContractAddr,
  ContractMap,
  NetworkTypeEnum,
  SupportedNetworkEnum,
} from 'palm-core/types'

const contractMap: Record<NetworkTypeEnum, ContractMap> = {
  [NetworkTypeEnum.MAINNET]: {
    [SupportedNetworkEnum.ETHEREUM]: {},
    [SupportedNetworkEnum.KLAYTN]: {},
    // https://docs.lens.xyz/docs/deployed-contract-addresses
    [SupportedNetworkEnum.POLYGON]: {
      lens_hub: '0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d' as ContractAddr,
      lens_follow_nft:
        '0xb0298c5540f4cfb3840c25d290be3ef3fe09fa8c' as ContractAddr,
      lens_periphery:
        '0xeff187b4190E551FC25a7fA4dFC6cf7fDeF7194f' as ContractAddr,
    },
  },
  [NetworkTypeEnum.TESTNET]: {
    [SupportedNetworkEnum.ETHEREUM]: {},
    [SupportedNetworkEnum.KLAYTN]: {},
    [SupportedNetworkEnum.POLYGON]: {
      lens_hub: '0x60Ae865ee4C725cd04353b5AAb364553f56ceF82' as ContractAddr,
      lens_follow_nft:
        '0x1a2bb1bc90aa5716f5eb85fd1823338bd1b6f772' as ContractAddr,
      lens_periphery:
        '0xD5037d72877808cdE7F669563e9389930AF404E8' as ContractAddr,
    },
  },
}

export default { contractMap }
