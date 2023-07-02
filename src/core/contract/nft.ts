import Web3Contract from 'core/complex/contract'
import {
  ContractAddr,
  EncodedTxData,
  StreamResultType,
  SupportedNetworkEnum,
} from 'core/types'
import { AbiItem } from 'web3-utils'

import nft from '../abi/Nft.json'

export class Nft {
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
      abi: nft as AbiItem[],
      contractAddress: nftContract,
      chain,
      onPostTxResult,
    })
  }

  name = async (): Promise<string | undefined> =>
    this.contract.callMethod<string>('name')

  isApprovedForAll = async ({
    owner,
    operator,
  }: {
    owner: ContractAddr
    operator: ContractAddr
  }): Promise<boolean | undefined> =>
    this.contract.callMethod<boolean>('isApprovedForAll', [owner, operator])

  /**
   * @returns owner of
   */
  ownerOf = async ({
    tokenId,
  }: {
    tokenId: string
  }): Promise<ContractAddr | undefined> =>
    this.contract.callMethod<ContractAddr>('ownerOf', [tokenId])

  /**
   * @returns token amount
   */
  balanceOf = async ({
    owner,
  }: {
    owner: ContractAddr
  }): Promise<string | undefined> =>
    this.contract.callMethod<string>('balanceOf', [owner])

  /**
   * @returns token id
   */
  tokenOfOwnerByIndex = async ({
    owner,
    index,
  }: {
    owner: ContractAddr
    index: number
  }): Promise<string | undefined> =>
    this.contract.callMethod<string>('tokenOfOwnerByIndex', [owner, index])

  /**
   * @returns ec721 token uri
   */
  tokenURI = async ({
    tokenId,
  }: {
    tokenId: string
  }): Promise<string | undefined> =>
    this.contract.callMethod<string>('tokenURI', [tokenId])

  /**
   * @returns erc1155 token uri
   */
  URI = async ({ tokenId }: { tokenId: string }): Promise<string | undefined> =>
    this.contract.callMethod<string>('uri', [tokenId])

  setApprovalForAllData = ({
    operator,
  }: {
    operator: ContractAddr
  }): EncodedTxData | undefined =>
    this.contract.getEncodedTxData('setApprovalForAll', [operator, true])

  transferFromData = ({
    from,
    to,
    tokenId,
  }: {
    from: ContractAddr
    to: ContractAddr
    tokenId: string
  }): EncodedTxData | undefined =>
    this.contract.getEncodedTxData('transferFrom', [from, to, tokenId])
}
