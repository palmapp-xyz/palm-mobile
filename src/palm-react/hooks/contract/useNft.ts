import nft from 'palm-core/abi/Nft.json'
import {
  ContractAddr,
  EncodedTxData,
  SupportedNetworkEnum,
} from 'palm-core/types'
import useContract from 'palm-react/hooks/complex/useContract'
import { AbiItem } from 'web3-utils'

export type UseNftReturn = {
  name: () => Promise<string | undefined>
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
  // ERC721
  tokenURI: (props: { tokenId: string }) => Promise<string | undefined>
  // ERC1155
  URI: (props: { tokenId: string }) => Promise<string | undefined>
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
  chain,
}: {
  nftContract: ContractAddr
  chain: SupportedNetworkEnum
}): UseNftReturn => {
  const { callMethod, getEncodedTxData } = useContract({
    abi: nft as AbiItem[],
    contractAddress: nftContract,
    chain,
  })

  const name = async (): Promise<string | undefined> =>
    callMethod<string>('name')

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
   * @returns ec721 token uri
   */
  const tokenURI = async ({
    tokenId,
  }: {
    tokenId: string
  }): Promise<string | undefined> => callMethod<string>('tokenURI', [tokenId])

  /**
   * @returns erc1155 token uri
   */
  const URI = async ({
    tokenId,
  }: {
    tokenId: string
  }): Promise<string | undefined> => callMethod<string>('uri', [tokenId])

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
    name,
    isApprovedForAll,
    ownerOf,
    balanceOf,
    tokenOfOwnerByIndex,
    tokenURI,
    URI,
    setApprovalForAllData,
    transferFromData,
  }
}

export default useNft
