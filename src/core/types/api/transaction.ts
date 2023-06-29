import { pToken } from '../currencies'

export namespace Transaction {
  export type Item = {
    block_num: number
    date: string
    hash: string
    status: string
    tx_type: string
    tx_fee: pToken
    value: pToken

    // Only FE
    dateForm: Date // from date
  }
}
