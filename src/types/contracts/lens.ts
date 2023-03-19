import { pToken } from '../currencies'
import { ContractAddr } from './common'

export namespace Lens {
  export type Nft = {
    addr: ContractAddr
    owner: ContractAddr
    price: pToken
    token_id: string
  }
}
