import React, { ReactElement } from 'react'
import { Pressable, PressableProps, View } from 'react-native'

import { GroupChannelProps, ReactionAddons, useSendbirdChat } from '@sendbird/uikit-react-native'
import { createStyleSheet } from '@sendbird/uikit-react-native-foundation'
import AdminMessage from '@sendbird/uikit-react-native/src/components/MessageRenderer/AdminMessage'
import MessageContainer from '@sendbird/uikit-react-native/src/components/MessageRenderer/MessageContainer'
import MessageDateSeparator from '@sendbird/uikit-react-native/src/components/MessageRenderer/MessageDateSeparator'
import MessageIncomingSenderName from '@sendbird/uikit-react-native/src/components/MessageRenderer/MessageIncomingSenderName'
import MessageOutgoingStatus from '@sendbird/uikit-react-native/src/components/MessageRenderer/MessageOutgoingStatus'
import MessageTime from '@sendbird/uikit-react-native/src/components/MessageRenderer/MessageTime'
import UnknownMessage from '@sendbird/uikit-react-native/src/components/MessageRenderer/UnknownMessage'
import UserMessage from '@sendbird/uikit-react-native/src/components/MessageRenderer/UserMessage'
import { DEFAULT_LONG_PRESS_DELAY } from '@sendbird/uikit-react-native/src/constants'
import {
  calcMessageGrouping, conditionChaining, isMyMessage, shouldRenderReaction, useIIFE
} from '@sendbird/uikit-utils'

import MessageIncomingAvatar from './MessageIncomingAvatar'
import NftMessage from './NftMessage'

import type { SendbirdMessage } from '@sendbird/uikit-utils'
type MessageStyleVariant = 'outgoing' | 'incoming'
export type MessageRendererInterface<
  T = SendbirdMessage,
  AdditionalProps = unknown
> = {
  message: T
  prevMessage?: SendbirdMessage
  nextMessage?: SendbirdMessage
  variant: MessageStyleVariant
  groupWithPrev: boolean
  groupWithNext: boolean
  pressed: boolean
  children?: React.ReactElement | null
} & AdditionalProps

const MessageRenderer: GroupChannelProps['Fragment']['renderMessage'] = ({
  currentUserId,
  channel,
  message,
  onPress,
  onLongPress,
  ...rest
}) => {
  const variant: MessageStyleVariant = isMyMessage(message, currentUserId)
    ? 'outgoing'
    : 'incoming'
  const isOutgoing = variant === 'outgoing'
  const isIncoming = variant === 'incoming'
  const variantContainerStyle = {
    incoming: styles.chatIncoming,
    outgoing: styles.chatOutgoing,
  }[variant]

  const { groupWithPrev, groupWithNext } = calcMessageGrouping(
    Boolean(rest.enableMessageGrouping),
    message,
    rest.prevMessage,
    rest.nextMessage
  )

  const { features } = useSendbirdChat()

  const reactionChildren = useIIFE(() => {
    if (
      shouldRenderReaction(channel, features.reactionEnabled) &&
      message.reactions &&
      message.reactions.length > 0
    ) {
      return <ReactionAddons.Message channel={channel} message={message} />
    }
    return null
  })

  const messageComponent = useIIFE(() => {
    const pressableProps: PressableProps = {
      style: styles.msgContainer,
      disabled: !onPress && !onLongPress,
      onPress,
      onLongPress,
      delayLongPress: DEFAULT_LONG_PRESS_DELAY,
    }
    const messageProps = { ...rest, variant, groupWithNext, groupWithPrev }

    if (message.isUserMessage()) {
      return (
        <Pressable {...pressableProps}>
          {({ pressed }): ReactElement => (
            <UserMessage
              message={message}
              pressed={pressed}
              onLongPressURL={onLongPress}
              onLongPressMentionedUser={onLongPress}
              {...messageProps}>
              {reactionChildren}
            </UserMessage>
          )}
        </Pressable>
      )
    }

    if (message.isFileMessage()) {
      return (
        <Pressable {...pressableProps}>
          {({ pressed }): ReactElement => (
            <NftMessage message={message} pressed={pressed} {...messageProps}>
              {reactionChildren}
            </NftMessage>
          )}
        </Pressable>
      )
    }

    if (message.isAdminMessage()) {
      return (
        <AdminMessage message={message} pressed={false} {...messageProps} />
      )
    }

    return (
      <Pressable {...pressableProps}>
        {({ pressed }): ReactElement => (
          <UnknownMessage
            message={message}
            pressed={pressed}
            {...messageProps}
          />
        )}
      </Pressable>
    )
  })

  return (
    <MessageContainer>
      <MessageDateSeparator message={message} prevMessage={rest.prevMessage} />
      {message.isAdminMessage() && messageComponent}
      {!message.isAdminMessage() && (
        <View
          style={[
            variantContainerStyle,
            conditionChaining(
              [groupWithNext, Boolean(rest.nextMessage)],
              [styles.chatGroup, styles.chatNonGroup, styles.chatLastMessage]
            ),
          ]}>
          {isOutgoing && (
            <View style={styles.outgoingContainer}>
              <MessageOutgoingStatus channel={channel} message={message} />
              <MessageTime
                message={message}
                grouping={groupWithNext}
                style={styles.timeOutgoing}
              />
            </View>
          )}
          {isIncoming && (
            <MessageIncomingAvatar message={message} grouping={groupWithNext} />
          )}
          <View style={styles.bubbleContainer}>
            {isIncoming && (
              <MessageIncomingSenderName
                message={message}
                grouping={groupWithPrev}
              />
            )}
            <View style={styles.bubbleWrapper}>
              {messageComponent}
              {isIncoming && (
                <MessageTime
                  message={message}
                  grouping={groupWithNext}
                  style={styles.timeIncoming}
                />
              )}
            </View>
          </View>
        </View>
      )}
    </MessageContainer>
  )
}

const styles = createStyleSheet({
  chatIncoming: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  chatOutgoing: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  timeIncoming: {
    marginLeft: 4,
  },
  timeOutgoing: {
    marginRight: 4,
  },
  chatGroup: {
    marginBottom: 2,
  },
  chatNonGroup: {
    marginBottom: 16,
  },
  chatLastMessage: {
    marginBottom: 16,
  },
  msgContainer: {
    maxWidth: 240,
  },
  bubbleContainer: {
    flexShrink: 1,
  },
  bubbleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  outgoingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
})

export default React.memo(MessageRenderer)
