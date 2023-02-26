import { useMemo, useState } from 'react'

import { useQueryClient } from 'react-query'

// import { UTIL } from 'consts'

import { ApiEnum, ContractAddr, Moralis, PostTxStatus } from 'types'
import usePostTx from 'hooks/complex/usePostTx'
import useNft from 'hooks/contract/useNft'
import useAuth from 'hooks/independent/useAuth'
// import useExplorer from 'hooks/complex/useExplorer'
import usePostTxStatusEffect, {
  EffectListType,
} from 'hooks/independent/usePostTxStatusEffect'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { navigationRef, Routes } from 'libs/navigation'

export type UseSendNftReturn = {
  isPosting: boolean
  onClickConfirm: () => Promise<void>
  isValidForm: boolean
}

const useSendNft = ({
  selectedNft,
  receiver,
}: {
  selectedNft: Moralis.NftItem
  receiver: ContractAddr
}): UseSendNftReturn => {
  const { navigation } = useAppNavigation()

  const [isPosting, setIsPosting] = useState(false)

  const { user } = useAuth()

  const { transferFromData } = useNft({
    nftContract: selectedNft?.token_address,
  })

  const { postTx } = usePostTx({ contractAddress: selectedNft.token_address })

  const queyrClient = useQueryClient()

  const isValidForm = !!receiver

  const onClickConfirm = async (): Promise<void> => {
    if (user?.address) {
      const data = transferFromData({
        from: user.address,
        to: receiver,
        tokenId: selectedNft.token_id,
      })

      postTx({ data })
    }
  }

  const effectList: EffectListType = useMemo(
    () => [
      {
        when: [PostTxStatus.POST],
        action: (): void => {
          setIsPosting(true)
        },
      },
      {
        when: [PostTxStatus.BROADCAST],
        action: async (act): Promise<void> => {
          if (user && act.status === PostTxStatus.BROADCAST && isPosting) {
            // await showImage(selectedNft.token_uri)
            // const hash = act.transactionHash
            // await sendMessage(
            //   `${UTIL.truncate(
            //     user.address
            //   )} is trying to send a NFT to ${UTIL.truncate(receiver)}\nID : ${
            //     selectedNft.token_id
            //   }`
            // )
            // await sendLink(
            //   getLink({ address: hash, type: 'tx' }),
            //   UTIL.truncate(hash)
            // )
          }
        },
      },
      {
        when: [PostTxStatus.DONE, PostTxStatus.ERROR],
        action: (act): void => {
          setIsPosting(false)
          queyrClient.removeQueries([ApiEnum.ASSETS])

          if (act.status === PostTxStatus.DONE) {
            if (Routes.SendNft === navigationRef.getCurrentRoute()?.name) {
              navigation.goBack()
            }
          }
        },
      },
    ],
    [user, isPosting]
  )
  usePostTxStatusEffect({ effectList })

  return {
    isPosting,
    onClickConfirm,
    isValidForm,
  }
}

export default useSendNft
