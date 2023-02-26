import { ContractAddr } from './contracts'
import { pToken } from './currencies'

export namespace zx {
  export type order = {
    erc20Token: ContractAddr
    erc20TokenAmount: pToken
    nftToken: ContractAddr
    nftTokenId: string
    nftTokenAmount: string
    nftType: 'ERC721'
    sellOrBuyNft: 'sell' | 'buy'
    chainId: '1' | '5'
    order: {
      direction: 0
      erc20Token: ContractAddr
      erc20TokenAmount: pToken
      erc721Token: ContractAddr
      erc721TokenId: string
      erc721TokenProperties: []
      expiry: string // '2524604400'
      fees: [
        {
          amount: pToken
          feeData: string // '0x'
          recipient: ContractAddr
        }
      ]
      maker: ContractAddr
      nonce: string // '100131415900000000000000000000000000000113490325799275354653114232382914267028'
      signature: {
        r: string // '0xab0375866a830aacc0bcf2ee9ffd7a23b8d9cb1e23d577b8e02849c7a456658b'
        s: string // '0x250a0ab415864b113c44d062620cd4c3a874cbed9e8592aec0999cdf4e6301f2'
        v: number // 27
        signatureType: number //  2
      }
      taker: ContractAddr // '0x0000000000000000000000000000000000000000'
    }
  }
}
