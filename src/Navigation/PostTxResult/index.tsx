import usePostTxStatusEffect from 'hooks/independent/usePostTxStatusEffect'
import React, { ReactElement, useMemo, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import postTxStore from 'store/postTxStore'
import { PostTxStatus, SupportedNetworkEnum } from 'types'

import TxStatus from './TxStatus'
import TxStatusMini from './TxStatusMini'

const PostTxResult = ({
  network,
}: {
  network: SupportedNetworkEnum
}): ReactElement => {
  const [isOpen, setIsOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const setPostTxResult = useSetRecoilState(postTxStore.postTxResult)

  const onClickClose = (): void => {
    setIsOpen(false)
    setMinimized(false)
    setPostTxResult({ status: PostTxStatus.READY, chain: network })
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
            network={network}
          />
        ) : (
          <TxStatus
            onPressClose={onClickClose}
            setMinimized={setMinimized}
            network={network}
          />
        ))}
    </>
  )
}

export default PostTxResult
