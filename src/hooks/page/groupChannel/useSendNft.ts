import { useMemo, useState } from 'react'

import { useQueryClient } from 'react-query'

// import { UTIL } from 'consts'

import {
  ApiEnum,
  ContractAddr,
  Moralis,
  PostTxReturn,
  PostTxStatus,
  SupportedNetworkEnum,
} from 'types'
import usePostTx from 'hooks/complex/usePostTx'
import useNft from 'hooks/contract/useNft'
import useAuth from 'hooks/independent/useAuth'
// import useExplorer from 'hooks/complex/useExplorer'
import usePostTxStatusEffect, {
  EffectListType,
} from 'hooks/independent/usePostTxStatusEffect'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { navigationRef, Routes } from 'libs/navigation'
import { chainIdToSupportedNetworkEnum } from 'libs/utils'

export type UseSendNftReturn = {
  isPosting: boolean
  onClickConfirm: () => Promise<PostTxReturn | undefined>
  isValidForm: boolean
}

const useSendNft = ({
  selectedNft,
  receiver,
}: {
  selectedNft: Moralis.NftItem
  receiver: ContractAddr | undefined
}): UseSendNftReturn => {
  const { navigation } = useAppNavigation()

  const [isPosting, setIsPosting] = useState(false)

  const { user } = useAuth()

  const { transferFromData } = useNft({
    nftContract: selectedNft?.token_address,
    chain:
      chainIdToSupportedNetworkEnum(selectedNft.chainId || '0x1') ||
      SupportedNetworkEnum.ETHEREUM,
  })

  const { postTx } = usePostTx({
    contractAddress: selectedNft.token_address,
    chain:
      chainIdToSupportedNetworkEnum(selectedNft.chainId || '0x1') ||
      SupportedNetworkEnum.ETHEREUM,
  })

  const queyrClient = useQueryClient()

  const isValidForm = !!receiver

  const onClickConfirm = async (): Promise<PostTxReturn | undefined> => {
    if (user?.address && receiver) {
      const data = transferFromData({
        from: user.address,
        to: receiver,
        tokenId: selectedNft.token_id,
      })

      return postTx({ data })
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
