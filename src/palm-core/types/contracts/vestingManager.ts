import { pToken } from '../currencies'
import { ContractAddr } from './'

export namespace VestingManager {
  export type Vesting = {
    contract_address: ContractAddr
    balance: pToken
    total_amount: pToken
    claimed_index: string
    recipient: ContractAddr
  }
}

export type ExtractVesting = {
  contract_address: ContractAddr
  recipient: ContractAddr
  balance: pToken
  total_amount: pToken
  claimed_index: string
  status: 'ready' | 'inProgress' | 'done'
}
