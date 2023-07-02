import useContract from 'hooks/complex/useContract'
import erc20 from 'palm-core/abi/erc20.json'
import {
  ContractAddr,
  EncodedTxData,
  SupportedNetworkEnum,
} from 'palm-core/types'
import { AbiItem } from 'web3-utils'

export type UseTokenReturn = {
  name: () => Promise<string | undefined>
  symbol: () => Promise<string | undefined>
  totalSupply: () => Promise<string | undefined>
  decimals: () => Promise<string | undefined>
  allowance: ({
    _owner,
    _spender,
  }: {
    _owner: ContractAddr
    _spender: ContractAddr
  }) => Promise<string | undefined>
  balanceOf: ({
    _owner,
  }: {
    _owner: ContractAddr
  }) => Promise<string | undefined>
  approve: ({
    _spender,
    _value,
  }: {
    _spender: ContractAddr
    _value: string
  }) => EncodedTxData | undefined
  transfer: ({
    _to,
    _value,
  }: {
    _to: ContractAddr
    _value: string
  }) => EncodedTxData | undefined
  transferFrom: ({
    _from,
    _to,
    _value,
  }: {
    _from: ContractAddr
    _to: ContractAddr
    _value: string
  }) => EncodedTxData | undefined
}

const useToken = ({
  tokenContract,
  chain,
}: {
  tokenContract: ContractAddr
  chain: SupportedNetworkEnum
}): UseTokenReturn => {
  const { callMethod, getEncodedTxData } = useContract({
    abi: erc20 as AbiItem[],
    contractAddress: tokenContract,
    chain,
  })

  const name = async (): Promise<string | undefined> =>
    callMethod<string>('name')

  const symbol = async (): Promise<string | undefined> =>
    callMethod<string>('symbol')

  const approve = ({
    _spender,
    _value,
  }: {
    _spender: ContractAddr
    _value: string
  }): EncodedTxData | undefined =>
    getEncodedTxData('approve', [_spender, _value])

  const totalSupply = async (): Promise<string | undefined> =>
    callMethod<string>('totalSupply')

  const transfer = ({
    _to,
    _value,
  }: {
    _to: ContractAddr
    _value: string
  }): EncodedTxData | undefined => getEncodedTxData('transfer', [_to, _value])

  const transferFrom = ({
    _from,
    _to,
    _value,
  }: {
    _from: ContractAddr
    _to: ContractAddr
    _value: string
  }): EncodedTxData | undefined =>
    getEncodedTxData('transferFrom', [_from, _to, _value])

  const decimals = async (): Promise<string | undefined> =>
    callMethod<string>('decimals')

  const balanceOf = async ({
    _owner,
  }: {
    _owner: ContractAddr
  }): Promise<string | undefined> => callMethod<string>('balanceOf', [_owner])

  const allowance = async ({
    _owner,
    _spender,
  }: {
    _owner: ContractAddr
    _spender: ContractAddr
  }): Promise<string | undefined> =>
    callMethod<string>('allowance', [_owner, _spender])

  return {
    name,
    symbol,
    totalSupply,
    approve,
    transfer,
    transferFrom,
    decimals,
    balanceOf,
    allowance,
  }
}

export default useToken
