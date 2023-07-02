import { ContractAddr } from '../contracts'

export enum AccountTypeEnum {
  SITE = 'SITE',
  GC = 'GC',
}

export enum AccountLevelEnum {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
}

export namespace Accounts {
  export type Item = {
    address: ContractAddr
    council_id: number
    id: number
    level: number
    type: number
  }
}

export type ExtractAccount = {
  address: ContractAddr
  council_id: number
  id: number
  isSiteOperator: boolean
  typeEnum: AccountTypeEnum
  levelEnum: AccountLevelEnum
}
