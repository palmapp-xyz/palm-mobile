import React, { ReactElement, useState, useMemo } from 'react'

import { PostTxStatus } from 'types'

import usePostTxStatusEffect from 'hooks/independent/usePostTxStatusEffect'
import TxStatus from './TxStatus'
import TxStatusMini from './TxStatusMini'

const PostTxResult = (): ReactElement => {
  const [isOpen, setIsOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)

  const onClickClose = (): void => {
    setIsOpen(false)
  }

  const effectList = useMemo(
    () => [
      {
        when: [PostTxStatus.BROADCAST, PostTxStatus.DONE, PostTxStatus.ERROR],
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
