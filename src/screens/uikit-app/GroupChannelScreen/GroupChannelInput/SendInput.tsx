import { COLOR } from 'consts'
import { UseGcInputReturn } from 'hooks/page/groupChannel/useGcInput'
import React, { forwardRef } from 'react'
import {
  NativeSyntheticEvent, Platform, TextInput as RNTextInput, TextInputSelectionChangeEventData,
  TouchableOpacity, View
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import { MentionType } from '@sendbird/chat/message'
import {
  GroupChannelProps, MentionedUser, useLocalization, useSendbirdChat
} from '@sendbird/uikit-react-native'
import {
  createStyleSheet, TextInput, useToast, useUIKitTheme
} from '@sendbird/uikit-react-native-foundation'
import { conditionChaining } from '@sendbird/uikit-utils'

type SendInputProps = GroupChannelProps['Input'] & {
  text: string
  onChangeText: (val: string) => void
  frozen: boolean
  muted: boolean
  disabled: boolean
  onSelectionChange: (
    e: NativeSyntheticEvent<TextInputSelectionChangeEventData>
  ) => void
  mentionedUsers: MentionedUser[]
  useGcInputReturn: UseGcInputReturn
}
const SendInput = forwardRef<RNTextInput, SendInputProps>(function SendInput(
  {
    onSendUserMessage,
    text,
    onChangeText,
    disabled,
    frozen,
    muted,
    onSelectionChange,
    mentionedUsers,
    useGcInputReturn,
  },
  ref
) {
  const { openBottomMenu, setOpenBottomMenu } = useGcInputReturn
  const { mentionManager } = useSendbirdChat()
  const { STRINGS } = useLocalization()
  const { colors } = useUIKitTheme()
  const toast = useToast()

  const onPressSend = (): void => {
    const mention = {
      userIds: mentionedUsers.map(it => it.user.userId),
      messageTemplate: mentionManager.textToMentionedMessageTemplate(
        text,
        mentionedUsers
      ),
      type: MentionType.USERS,
    }

    onSendUserMessage(text, mention).catch(() =>
      toast.show(STRINGS.TOAST.SEND_MSG_ERROR, 'error')
    )
    onChangeText('')
  }

  return (
    <View style={styles.sendInputContainer}>
      <TouchableOpacity
        onPress={(): void => {
          setOpenBottomMenu(!openBottomMenu)
        }}
        disabled={disabled}>
        <Icon
          color={disabled ? COLOR.primary._100 : COLOR.primary._400}
          name={openBottomMenu ? 'close-circle' : 'add-circle'}
          size={36}
        />
      </TouchableOpacity>
      <TextInput
        ref={ref}
        multiline
        disableFullscreenUI
        onSelectionChange={onSelectionChange}
        editable={!disabled}
        onChangeText={onChangeText}
        style={[
          styles.input,
          {
            backgroundColor: 'white',
            borderColor: '#0D0E101a',
            borderWidth: 1,
            borderRadius: 14,
            fontSize: 14,
            lineHeight: 18,
            justifyContent: 'center',
            paddingHorizontal: 14,
            paddingTop: 9,
            marginLeft: 12,
          },
        ]}
        placeholder={conditionChaining(
          [frozen, muted],
          [
            STRINGS.GROUP_CHANNEL.INPUT_PLACEHOLDER_DISABLED,
            STRINGS.GROUP_CHANNEL.INPUT_PLACEHOLDER_MUTED,
            STRINGS.GROUP_CHANNEL.INPUT_PLACEHOLDER_ACTIVE,
          ]
        )}>
        {mentionManager.textToMentionedComponents(text, mentionedUsers)}
      </TextInput>

      {Boolean(text.trim()) && (
        <TouchableOpacity onPress={onPressSend} disabled={disabled}>
          <Icon
            color={
              disabled ? colors.ui.input.default.disabled.highlight : '#A7ABB4'
            }
            name={'send'}
            size={24}
          />
        </TouchableOpacity>
      )}
    </View>
  )
})

const styles = createStyleSheet({
  sendInputContainer: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    marginRight: 4,
    minHeight: 36,
    maxHeight: 36 * Platform.select({ ios: 2.5, default: 2 }),
    borderRadius: 20,
  },

  iconSend: {
    marginLeft: 4,
    padding: 4,
  },
})

export default SendInput
