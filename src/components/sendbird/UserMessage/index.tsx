import React, { ReactElement } from 'react'

import OpenGraphUserMessage from '@sendbird/uikit-react-native/src/components/MessageRenderer/UserMessage/OpenGraphUserMessage'
import type { SendbirdUserMessage } from '@sendbird/uikit-utils'

import { MessageRendererInterface } from '../MessageRenderer'
import BaseUserMessage from './BaseUserMessage'

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
  return <BaseUserMessage {...props} />
}

export default React.memo(UserMessage)
