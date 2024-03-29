import { PostTxStatus, StreamResultType } from 'palm-core/types'
import postTxStore from 'palm-react/store/postTxStore'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'

export type EffectListType = {
  when: PostTxStatus[]
  action: ((postTxResult: StreamResultType) => void) | (() => void)
}[]

const usePostTxStatusEffect = ({
  effectList,
}: {
  effectList: EffectListType
}): void => {
  const postTxResult = useRecoilValue(postTxStore.postTxResult)

  useEffect(() => {
    if (postTxResult.status) {
      const actionList = effectList.filter(x =>
        x.when.includes(postTxResult.status)
      )
      if (actionList.length > 0) {
        actionList.forEach(x => {
          x.action(postTxResult)
        })
      }
    }
  }, [postTxResult.status])
}

export default usePostTxStatusEffect
