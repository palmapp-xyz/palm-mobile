import { useMemo } from 'react'

import { AbiItem } from 'web3-utils'

import escrow from '../../abi/Escrow.json'

import { ContractAddr, EncodedTxData, Escrow, pToken } from 'types'
import useContract from 'hooks/complex/useContract'
import useNetwork from 'hooks/complex/useNetwork'

export type UseNftReturn = {
  escrowContract: ContractAddr
  getNftsByChannel: (props: {
    channelUrl: string
  }) => Promise<Escrow.Nft[] | undefined>
  sellNftData: (props: {
    nftContract: ContractAddr
    tokenId: string
    price: pToken
    channelUrl: string
    whitelist: ContractAddr[]
  }) => EncodedTxData | undefined
  buyNftData: (props: {
    channelUrl: string
    nftContract: ContractAddr
    tokenId: string
  }) => EncodedTxData | undefined
  withdrawNftData: (props: {
    channelUrl: string
    nftContract: ContractAddr
    tokenId: string
  }) => EncodedTxData | undefined
}

const useEscrow = (): UseNftReturn => {
  const { contractMap } = useNetwork()
  const escrowContract = useMemo(() => contractMap.escrow, [contractMap])

  const { callMethod, getEncodedTxData } = useContract({
    abi: escrow as AbiItem[],
    contractAddress: escrowContract,
  })

  const getNftsByChannel = async ({
    channelUrl,
  }: {
    channelUrl: string
  }): Promise<Escrow.Nft[] | undefined> =>
    callMethod<Escrow.Nft[]>('getNftsByChannel', [channelUrl])

  const sellNftData = ({
    nftContract,
    tokenId,
    price,
    channelUrl,
    whitelist,
  }: {
    nftContract: ContractAddr
    tokenId: string
    price: pToken
    channelUrl: string
    whitelist: ContractAddr[]
  }): EncodedTxData | undefined =>
    getEncodedTxData('sellNft', [
      nftContract,
      tokenId,
      price,
      channelUrl,
      whitelist,
    ])

  const buyNftData = ({
    channelUrl,
    nftContract,
    tokenId,
  }: {
    channelUrl: string
    nftContract: ContractAddr
    tokenId: string
  }): EncodedTxData | undefined =>
    getEncodedTxData('buyNft', [channelUrl, nftContract, tokenId])

  const withdrawNftData = ({
    channelUrl,
    nftContract,
    tokenId,
  }: {
    channelUrl: string
    nftContract: ContractAddr
    tokenId: string
  }): EncodedTxData | undefined =>
    getEncodedTxData('withdrawNft', [channelUrl, nftContract, tokenId])

  return {
    escrowContract,
    getNftsByChannel,
    sellNftData,
    buyNftData,
    withdrawNftData,
  }
}

export default useEscrow
