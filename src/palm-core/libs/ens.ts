import { UTIL } from 'palm-core/libs'
import { ContractAddr } from 'palm-core/types'

export const isENS = (nftContract: string | ContractAddr): boolean =>
  UTIL.compareContractAddr(
    nftContract,
    '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85'
  )
