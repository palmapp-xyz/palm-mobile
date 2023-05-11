import useAuth from 'hooks/auth/useAuth'
import usePostTx from 'hooks/complex/usePostTx'
import useNft from 'hooks/contract/useNft'
// import useExplorer from 'hooks/complex/useExplorer'
import usePostTxStatusEffect, {
  EffectListType,
} from 'hooks/independent/usePostTxStatusEffect'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { navigationRef, Routes } from 'libs/navigation'
import { chainIdToSupportedNetworkEnum } from 'libs/utils'
import { useEffect, useMemo, useState } from 'react'
import { useQueryClient } from 'react-query'
// import { UTIL } from 'consts'
import {
  ApiEnum,
  ContractAddr,
  Moralis,
  PostTxReturn,
  PostTxStatus,
  pToken,
  SupportedNetworkEnum,
} from 'types'

export type UseSendNftReturn = {
  isPosting: boolean
  onClickConfirm: () => Promise<PostTxReturn | undefined>
  isValidForm: boolean
  estimatedTxFee: pToken
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
  const [estimatedTxFee, setEstimatedTxFee] = useState<pToken>('0' as pToken)

  const { user } = useAuth()

  const { transferFromData } = useNft({
    nftContract: selectedNft?.token_address,
    chain:
      chainIdToSupportedNetworkEnum(selectedNft.chainId || '0x1') ||
      SupportedNetworkEnum.ETHEREUM,
  })

  const { getTxFee, postTx } = usePostTx({
    contractAddress: selectedNft.token_address,
    chain:
      chainIdToSupportedNetworkEnum(selectedNft.chainId || '0x1') ||
      SupportedNetworkEnum.ETHEREUM,
  })

  const queyrClient = useQueryClient()

  const isValidForm = !!receiver

  const postData = useMemo(() => {
    if (user?.address && receiver) {
      return transferFromData({
        from: user.address,
        to: receiver,
        tokenId: selectedNft.token_id,
      })
    }
  }, [user?.address, receiver])

  const onClickConfirm = async (): Promise<PostTxReturn | undefined> => {
    return postTx({ data: postData })
  }

  useEffect(() => {
    getTxFee({ data: postData }).then(val => {
      setEstimatedTxFee(val)
    })
  }, [postData])

  const effectList: EffectListType = useMemo(
    () => [
      {
        when: [PostTxStatus.POST],
        action: (): void => {
          setIsPosting(true)
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
    estimatedTxFee,
  }
}

export default useSendNft
