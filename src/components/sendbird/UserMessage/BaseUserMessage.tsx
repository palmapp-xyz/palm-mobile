import React, { ReactElement } from 'react'
import { View } from 'react-native'

import {
  createStyleSheet,
  RegexText,
  Text,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation'
import { urlRegexStrict } from '@sendbird/uikit-utils'

import {
  useLocalization,
  useSendbirdChat,
  useUserProfile,
} from '@sendbird/uikit-react-native'
import SBUUtils from '@sendbird/uikit-react-native/src/libs/SBUUtils'
import { COLOR } from 'consts'
import type { UserMessageProps } from './index'

const BaseUserMessage = ({
  message,
  variant,
  pressed,
  children,
  onLongPressMentionedUser,
  onLongPressURL,
}: UserMessageProps): ReactElement => {
  const { mentionManager, currentUser } = useSendbirdChat()
  const { show } = useUserProfile()
  const { STRINGS } = useLocalization()
  const { palette } = useUIKitTheme()

  const backgroundColor = pressed
    ? COLOR.black._200
    : variant === 'outgoing'
    ? COLOR.black._90010
    : 'white'

  function replacerA({
    match,
    groups,
    parentProps,
    index,
    keyPrefix,
  }): string | JSX.Element {
    const user = message.mentionedUsers?.find(it => it.userId === groups[2])
    if (user) {
      return (
        <Text
          {...parentProps}
          key={`${keyPrefix}-${index}`}
          onPress={(): void => show(user)}
          onLongPress={onLongPressMentionedUser}
          style={[
            parentProps?.style,
            { fontWeight: 'bold', fontSize: 12 },
            user.userId === currentUser?.userId && {
              backgroundColor: palette.highlight,
            },
          ]}
        >
          {`${mentionManager.asMentionedMessageText(user)}`}
        </Text>
      )
    }
    return match
  }

  function replacerB({ match, parentProps, index, keyPrefix }): JSX.Element {
    return (
      <Text
        {...parentProps}
        key={`${keyPrefix}-${index}`}
        onPress={(): void => SBUUtils.openURL(match)}
        onLongPress={onLongPressURL}
        style={[
          parentProps?.style,
          { textDecorationLine: 'underline', fontSize: 12 },
        ]}
      >
        {match}
      </Text>
    )
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          borderColor:
            variant === 'outgoing' ? 'transparent' : COLOR.black._90010,
        },
      ]}
    >
      <View style={styles.wrapper}>
        <Text body3 color={COLOR.black._900} style={{ fontSize: 12 }}>
          <RegexText
            body3
            color={COLOR.black._900}
            patterns={[
              {
                regex: mentionManager.templateRegex,
                replacer: replacerA,
              },
              {
                regex: urlRegexStrict,
                replacer: replacerB,
              },
            ]}
            style={{
              fontSize: 14,
              lineHeight: 18,
              fontWeight: '400',
            }}
          >
            {mentionManager.shouldUseMentionedMessageTemplate(message)
              ? message.mentionedMessageTemplate
              : message.message}
          </RegexText>
          {Boolean(message.updatedAt) && (
            <Text body3 color={COLOR.black._400} style={{ fontSize: 12 }}>
              {STRINGS.GROUP_CHANNEL.MESSAGE_BUBBLE_EDITED_POSTFIX}
            </Text>
          )}
        </Text>
      </View>
      {children}
    </View>
  )
}
const styles = createStyleSheet({
  container: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
  },
  wrapper: {
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
})

export default BaseUserMessage
