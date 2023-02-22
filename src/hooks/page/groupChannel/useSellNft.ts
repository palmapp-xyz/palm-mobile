import { useState } from 'react'

import { UTIL } from 'consts'

import { ContractAddr, Moralis, Token } from 'types'
import useNetwork from 'hooks/complex/useNetwork'
import usePostTx from 'hooks/complex/usePostTx'
import useEscrow from 'hooks/contract/useEscrow'

export type UseSellNftReturn = {
  price: Token
  setPrice: React.Dispatch<React.SetStateAction<Token>>
  onClickConfirm: () => Promise<void>
  isValidForm: boolean
}

const useSellNft = ({
  selectedItem,
  channelId,
  whitelist,
}: {
  selectedItem: Moralis.NftItem
  channelId: string
  whitelist: ContractAddr[]
}): UseSellNftReturn => {
  const { contractMap } = useNetwork()
  const [price, setPrice] = useState<Token>('' as Token)

  const { sellNftData } = useEscrow()

  const { postTx } = usePostTx({ contractAddress: contractMap.escrow })

  const isValidForm = !!price

  const onClickConfirm = async (): Promise<void> => {
    const data = sellNftData({
      nftContract: selectedItem.token_address,
      tokenId: selectedItem.token_id,
      price: UTIL.microfyP(price),
      channelId,
      whitelist,
    })
    await postTx({ data })
  }

  return {
    price,
    setPrice,
    onClickConfirm,
    isValidForm,
  }
}

export default useSellNft
