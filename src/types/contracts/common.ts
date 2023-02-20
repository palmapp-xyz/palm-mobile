import { NominalType } from '../common'

export type ContractAddr = string & NominalType<'ContractAddr'>
export type EncodedTxData = string & NominalType<'EncodedTxData'>

export type ContractMap = {
  escrow: ContractAddr
}
