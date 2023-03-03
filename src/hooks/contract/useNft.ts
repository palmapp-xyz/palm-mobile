import { AbiItem } from 'web3-utils'

import abi from '../../abi/Nft.json'

import { ContractAddr, EncodedTxData } from 'types'
import useContract from 'hooks/complex/useContract'

export type UseNftReturn = {
  isApprovedForAll: (props: {
    owner: ContractAddr
    operator: ContractAddr
  }) => Promise<boolean | undefined>
  ownerOf: (props: { tokenId: string }) => Promise<ContractAddr | undefined>
  balanceOf: (props: { owner: ContractAddr }) => Promise<string | undefined>
  tokenOfOwnerByIndex: (props: {
    owner: ContractAddr
    index: number
  }) => Promise<string | undefined>
  tokenURI: (props: { tokenId: string }) => Promise<string | undefined>
  setApprovalForAllData: (props: {
    operator: ContractAddr
  }) => EncodedTxData | undefined
  transferFromData: (props: {
    from: ContractAddr
    to: ContractAddr
    tokenId: string
  }) => EncodedTxData | undefined
}

const useNft = ({
  nftContract,
}: {
  nftContract: ContractAddr
}): UseNftReturn => {
  const { callMethod, getEncodedTxData } = useContract({
    abi: abi as AbiItem[],
    contractAddress: nftContract,
  })

  const isApprovedForAll = async ({
    owner,
    operator,
  }: {
    owner: ContractAddr
    operator: ContractAddr
  }): Promise<boolean | undefined> =>
    callMethod<boolean>('isApprovedForAll', [owner, operator])

  /**
   * @returns owner of
   */
  const ownerOf = async ({
    tokenId,
  }: {
    tokenId: string
  }): Promise<ContractAddr | undefined> =>
    callMethod<ContractAddr>('ownerOf', [tokenId])

  /**
   * @returns token amount
   */
  const balanceOf = async ({
    owner,
  }: {
    owner: ContractAddr
  }): Promise<string | undefined> => callMethod<string>('balanceOf', [owner])

  /**
   * @returns token id
   */
  const tokenOfOwnerByIndex = async ({
    owner,
    index,
  }: {
    owner: ContractAddr
    index: number
  }): Promise<string | undefined> =>
    callMethod<string>('tokenOfOwnerByIndex', [owner, index])

  /**
   * @returns token uri
   */
  const tokenURI = async ({
    tokenId,
  }: {
    tokenId: string
  }): Promise<string | undefined> => callMethod<string>('tokenURI', [tokenId])

  const setApprovalForAllData = ({
    operator,
  }: {
    operator: ContractAddr
  }): EncodedTxData | undefined =>
    getEncodedTxData('setApprovalForAll', [operator, true])

  const transferFromData = ({
    from,
    to,
    tokenId,
  }: {
    from: ContractAddr
    to: ContractAddr
    tokenId: string
  }): EncodedTxData | undefined =>
    getEncodedTxData('transferFrom', [from, to, tokenId])

  return {
    isApprovedForAll,
    ownerOf,
    balanceOf,
    tokenOfOwnerByIndex,
    tokenURI,
    setApprovalForAllData,
    transferFromData,
  }
}

export default useNft
