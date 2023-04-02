import { ContractAddr } from 'types'
import { compareContractAddr } from './utils'

export const isENS = (nftContract: string | ContractAddr): boolean =>
  compareContractAddr(nftContract, '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85')
