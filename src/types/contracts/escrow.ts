import { pToken } from '../currencies'
import { ContractAddr } from './common'

export namespace Escrow {
  export type Nft = {
    addr: ContractAddr
    owner: ContractAddr
    price: pToken
    token_id: string
  }
}
