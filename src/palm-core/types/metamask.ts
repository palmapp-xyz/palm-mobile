// https://docs.metamask.io/guide/rpc-api.html

export interface AddEthereumChainParameter {
  chainId: string // A 0x-prefixed hexadecimal string
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string // 2-6 characters long
    decimals: 18
    logo: any
  }
  rpcUrls: string[]
  blockExplorerUrls: string[]
  iconUrls?: string[] // Currently ignored.
}
