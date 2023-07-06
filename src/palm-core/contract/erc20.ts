import Web3Contract from 'palm-core/complex/contract'
import {
  ContractAddr,
  EncodedTxData,
  StreamResultType,
  SupportedNetworkEnum,
} from 'palm-core/types'
import { AbiItem } from 'web3-utils'

import erc20 from '../abi/erc20.json'

export class Erc20 {
  contract: Web3Contract

  constructor({
    nftContract,
    chain,
    onPostTxResult,
  }: {
    nftContract: ContractAddr
    chain: SupportedNetworkEnum
    onPostTxResult?: (result: StreamResultType) => Promise<void>
  }) {
    this.contract = new Web3Contract({
      abi: erc20 as AbiItem[],
      contractAddress: nftContract,
      chain,
      onPostTxResult,
    })
  }

  name = async (): Promise<string | undefined> =>
    this.contract.callMethod<string>('name')

  symbol = async (): Promise<string | undefined> =>
    this.contract.callMethod<string>('symbol')

  approve = ({
    _spender,
    _value,
  }: {
    _spender: ContractAddr
    _value: string
  }): EncodedTxData | undefined =>
    this.contract.getEncodedTxData('approve', [_spender, _value])

  totalSupply = async (): Promise<string | undefined> =>
    this.contract.callMethod<string>('totalSupply')

  transfer = ({
    _to,
    _value,
  }: {
    _to: ContractAddr
    _value: string
  }): EncodedTxData | undefined =>
    this.contract.getEncodedTxData('transfer', [_to, _value])

  transferFrom = ({
    _from,
    _to,
    _value,
  }: {
    _from: ContractAddr
    _to: ContractAddr
    _value: string
  }): EncodedTxData | undefined =>
    this.contract.getEncodedTxData('transferFrom', [_from, _to, _value])

  decimals = async (): Promise<string | undefined> =>
    this.contract.callMethod<string>('decimals')

  balanceOf = async ({
    _owner,
  }: {
    _owner: ContractAddr
  }): Promise<string | undefined> =>
    this.contract.callMethod<string>('balanceOf', [_owner])

  allowance = async ({
    _owner,
    _spender,
  }: {
    _owner: ContractAddr
    _spender: ContractAddr
  }): Promise<string | undefined> =>
    this.contract.callMethod<string>('allowance', [_owner, _spender])
}
