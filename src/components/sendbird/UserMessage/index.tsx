import { parseMsgData } from 'core/libs/sendbird'
import React, { ReactElement } from 'react'

import OpenGraphUserMessage from '@sendbird/uikit-react-native/src/components/MessageRenderer/UserMessage/OpenGraphUserMessage'

import { MessageRendererInterface } from '../MessageRenderer'
import BaseUserMessage from './BaseUserMessage'
import SendTokenMessage from './SendTokenMessage'

import type { SendbirdUserMessage } from '@sendbird/uikit-utils'

export type UserMessageProps = MessageRendererInterface<
  SendbirdUserMessage,
  {
    onLongPressMentionedUser?: () => void
    onLongPressURL?: () => void
  }
>

const UserMessage = (props: UserMessageProps): ReactElement => {
  if (props.message.ogMetaData) {
    return (
      <OpenGraphUserMessage {...props} ogMetaData={props.message.ogMetaData} />
    )
  }

  const parsedData = parseMsgData(props.message.data || '')

  if (!props.message.customType) {
    return <BaseUserMessage {...props} />
  }

  if (parsedData) {
    switch (parsedData.type) {
      case 'send-token':
        return <SendTokenMessage data={parsedData} />
    }
  }

  return <BaseUserMessage {...props} />
}

export default React.memo(UserMessage)
