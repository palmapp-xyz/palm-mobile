import { useMemo } from 'react'

import { AbiItem } from 'web3-utils'

import abi from '../../abi/Escrow.json'

import { ContractAddr, EncodedTxData, Escrow, pToken } from 'types'
import useContract from 'hooks/complex/useContract'
import useNetwork from 'hooks/complex/useNetwork'

export type UseNftReturn = {
  escrowContract: ContractAddr
  getNftsByChannel: (props: {
    channelId: string
  }) => Promise<Escrow.Nft[] | undefined>
  sellNftData: (props: {
    nftContract: ContractAddr
    tokenId: string
    price: pToken
    channelId: string
    whitelist: ContractAddr[]
  }) => EncodedTxData | undefined
  buyNftData: (props: {
    channelId: string
    nftContract: ContractAddr
    tokenId: string
  }) => EncodedTxData | undefined
  withdrawNftData: (props: {
    channelId: string
    nftContract: ContractAddr
    tokenId: string
  }) => EncodedTxData | undefined
}

const useEscrow = (): UseNftReturn => {
  const { contractMap } = useNetwork()
  const escrowContract = useMemo(() => contractMap.escrow, [contractMap])

  const { callMethod, getEncodedTxData } = useContract({
    abi: abi as AbiItem[],
    contractAddress: escrowContract,
  })

  const getNftsByChannel = async ({
    channelId,
  }: {
    channelId: string
  }): Promise<Escrow.Nft[] | undefined> =>
    callMethod<Escrow.Nft[]>('getNftsByChannel', [channelId])

  const sellNftData = ({
    nftContract,
    tokenId,
    price,
    channelId,
    whitelist,
  }: {
    nftContract: ContractAddr
    tokenId: string
    price: pToken
    channelId: string
    whitelist: ContractAddr[]
  }): EncodedTxData | undefined =>
    getEncodedTxData('sellNft', [
      nftContract,
      tokenId,
      price,
      channelId,
      whitelist,
    ])

  const buyNftData = ({
    channelId,
    nftContract,
    tokenId,
  }: {
    channelId: string
    nftContract: ContractAddr
    tokenId: string
  }): EncodedTxData | undefined =>
    getEncodedTxData('buyNft', [channelId, nftContract, tokenId])

  const withdrawNftData = ({
    channelId,
    nftContract,
    tokenId,
  }: {
    channelId: string
    nftContract: ContractAddr
    tokenId: string
  }): EncodedTxData | undefined =>
    getEncodedTxData('withdrawNft', [channelId, nftContract, tokenId])

  return {
    escrowContract,
    getNftsByChannel,
    sellNftData,
    buyNftData,
    withdrawNftData,
  }
}

export default useEscrow
