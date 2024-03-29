import { PostTxStatus, SupportedNetworkEnum } from 'palm-core/types'
import usePostTxStatusEffect from 'palm-react/hooks/independent/usePostTxStatusEffect'
import postTxStore from 'palm-react/store/postTxStore'
import React, { ReactElement, useMemo, useState } from 'react'
import { useSetRecoilState } from 'recoil'

import TxStatus from './TxStatus'
import TxStatusMini from './TxStatusMini'

const PostTxResult = (): ReactElement => {
  const [isOpen, setIsOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const setPostTxResult = useSetRecoilState(postTxStore.postTxResult)

  const onClickClose = (): void => {
    setIsOpen(false)
    setMinimized(false)
    setPostTxResult({
      status: PostTxStatus.READY,
      chain: SupportedNetworkEnum.ETHEREUM,
    })
  }

  const effectList = useMemo(
    () => [
      {
        when: [
          PostTxStatus.POST,
          PostTxStatus.BROADCAST,
          PostTxStatus.DONE,
          PostTxStatus.ERROR,
        ],
        action: (): void => setIsOpen(true),
      },
    ],
    []
  )
  usePostTxStatusEffect({ effectList })

  return (
    <>
      {isOpen &&
        (minimized ? (
          <TxStatusMini
            onPressClose={onClickClose}
            setMinimized={setMinimized}
          />
        ) : (
          <TxStatus onPressClose={onClickClose} setMinimized={setMinimized} />
        ))}
    </>
  )
}

export default PostTxResult
