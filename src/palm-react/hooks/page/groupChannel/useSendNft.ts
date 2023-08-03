// import useExplorer from 'hooks/complex/useExplorer'
import { logEvent } from 'firebase/analytics'
import { analytics } from 'palm-core/firebase'
import { UTIL } from 'palm-core/libs'
import { navigationRef, Routes } from 'palm-core/libs/navigation'
import {
  ApiEnum,
  ContractAddr,
  Moralis,
  PostTxReturn,
  PostTxStatus,
  pToken,
  SupportedNetworkEnum,
} from 'palm-core/types'
// import { UTIL } from 'palm-core/libs'
import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import useAuth from 'palm-react/hooks/auth/useAuth'
import usePostTx from 'palm-react/hooks/complex/usePostTx'
import useNft from 'palm-react/hooks/contract/useNft'
import usePostTxStatusEffect, {
  EffectListType,
} from 'palm-react/hooks/independent/usePostTxStatusEffect'
import { useEffect, useMemo, useState } from 'react'
import { useQueryClient } from 'react-query'

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
      UTIL.chainIdToSupportedNetworkEnum(selectedNft.chainId || '0x1') ||
      SupportedNetworkEnum.ETHEREUM,
  })

  const { getTxFee, postTx } = usePostTx({
    contractAddress: selectedNft.token_address,
    chain:
      UTIL.chainIdToSupportedNetworkEnum(selectedNft.chainId || '0x1') ||
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
    logEvent(analytics, 'send_nft_confirm')
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
