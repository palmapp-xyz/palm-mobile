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
import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import useAuth from 'palm-react/hooks/auth/useAuth'
import usePostTx from 'palm-react/hooks/complex/usePostTx'
import useToken from 'palm-react/hooks/contract/useToken'
import usePostTxStatusEffect, {
  EffectListType,
} from 'palm-react/hooks/independent/usePostTxStatusEffect'
import { useEffect, useMemo, useState } from 'react'
import { useQueryClient } from 'react-query'

export type UseSendTokenReturn = {
  isPosting: boolean
  onClickConfirm: () => Promise<PostTxReturn | undefined>
  isValidForm: boolean
  estimatedTxFee: pToken
}

const useSendToken = ({
  selectedToken,
  receiver,
  value,
}: {
  selectedToken: Moralis.FtItem
  receiver: ContractAddr | undefined
  value: pToken
}): UseSendTokenReturn => {
  const { navigation } = useAppNavigation()

  const [isPosting, setIsPosting] = useState(false)
  const [estimatedTxFee, setEstimatedTxFee] = useState<pToken>('0' as pToken)

  const { user } = useAuth()

  const { transferFrom } = useToken({
    tokenContract: selectedToken?.token_address,
    chain:
      UTIL.chainIdToSupportedNetworkEnum(selectedToken.chainId || '0x1') ||
      SupportedNetworkEnum.ETHEREUM,
  })

  const { getTxFee, postTx } = usePostTx({
    contractAddress: selectedToken.token_address,
    chain:
      UTIL.chainIdToSupportedNetworkEnum(selectedToken.chainId || '0x1') ||
      SupportedNetworkEnum.ETHEREUM,
  })

  const queyrClient = useQueryClient()

  const isValidForm = useMemo(
    () =>
      !!receiver &&
      UTIL.toBn(selectedToken.balance).gte(
        UTIL.toBn(value).plus(UTIL.toBn(estimatedTxFee))
      ),
    [receiver, estimatedTxFee, value]
  )

  const postData = useMemo(() => {
    if (user?.address && receiver) {
      return selectedToken.token_address !== ('0x0' as ContractAddr)
        ? transferFrom({
            _from: user.address,
            _to: receiver,
            _value: value,
          })
        : undefined
    }
  }, [user?.address, receiver, value])

  const onClickConfirm = async (): Promise<PostTxReturn | undefined> => {
    return postTx({ data: postData, to: receiver, value })
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
            if (Routes.SendToken === navigationRef.getCurrentRoute()?.name) {
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

export default useSendToken
