import useGcInput from 'palm-react/hooks/page/groupChannel/useGcInput'
import React, {
  MutableRefObject,
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { KeyboardAvoidingView, Platform, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import {
  GroupChannelContexts,
  GroupChannelProps,
  useSendbirdChat,
} from '@sendbird/uikit-react-native'
import { createStyleSheet } from '@sendbird/uikit-react-native-foundation'
import {
  SuggestedMentionListProps,
} from '@sendbird/uikit-react-native/src/components/ChannelInput'
import useMentionTextInput from '@sendbird/uikit-react-native/src/hooks/useMentionTextInput'
import {
  getGroupChannelChatAvailableState,
  replace,
  SendbirdFileMessage,
  SendbirdGroupChannel,
  SendbirdUserMessage,
  useIIFE,
} from '@sendbird/uikit-utils'

import BottomMenu from './BottomMenu'
import EditInput from './EditInput'
import SelectAssetList from './SelectAssetList'
import SelectReceiverModal from './SelectReceiverModal'
import SendInput from './SendInput'

const AUTO_FOCUS = Platform.select({
  ios: false,
  android: true,
  default: false,
})
const KEYBOARD_AVOID_VIEW_BEHAVIOR = Platform.select({
  ios: 'padding' as const,
  default: undefined,
})

// FIXME(iOS): Dynamic style does not work properly when typing the CJK. (https://github.com/facebook/react-native/issues/26107)
//  To workaround temporarily, change the key for re-mount the component.
//  -> This will affect to keyboard blur when add/remove first mentioned user.
const GET_INPUT_KEY = (shouldReset: boolean): string =>
  shouldReset ? 'uikit-input-clear' : 'uikit-input'

// TODO: Refactor 'Edit' mode to clearly
const GroupChannelInput = (props: GroupChannelProps['Input']): ReactElement => {
  const { top, left, right, bottom } = useSafeAreaInsets()

  const { features, mentionManager } = useSendbirdChat()
  const {
    channel,
    messageToEdit,
    setMessageToEdit,
    keyboardAvoidOffset = 0,
  } = useContext(GroupChannelContexts.Fragment)

  const useGcInputReturn = useGcInput({
    ...props,
    channel,
  })

  const chatAvailableState = getGroupChannelChatAvailableState(channel)
  const mentionAvailable =
    features.userMentionEnabled &&
    channel.isGroupChannel() &&
    !channel.isBroadcast
  const inputMode = useIIFE(() => {
    if (!messageToEdit) {
      return 'send'
    }
    if (messageToEdit.isFileMessage()) {
      return 'send'
    }
    return 'edit'
  })

  const [inputHeight, setInputHeight] = useState(styles.inputDefault.height)

  const {
    selection,
    onSelectionChange,
    textInputRef,
    text,
    onChangeText,
    mentionedUsers,
  } = useMentionTextInput({ messageToEdit })

  useTypingTrigger(text, channel)
  useTextPersistenceOnDisabled(text, onChangeText, chatAvailableState.disabled)
  useAutoFocusOnEditMode(textInputRef, messageToEdit)

  const onPressToMention: GroupChannelProps['SuggestedMentionList']['onPressToMention'] =
    (user, searchStringRange) => {
      const mentionedMessageText = mentionManager.asMentionedMessageText(
        user,
        true
      )
      const range = {
        start: searchStringRange.start,
        end: searchStringRange.start + mentionedMessageText.length - 1,
      }

      onChangeText(
        replace(
          text,
          searchStringRange.start,
          searchStringRange.end,
          mentionedMessageText
        ),
        { user, range }
      )
    }

  if (!props.shouldRenderInput) {
    return <SafeAreaBottom height={bottom} />
  }

  const SuggestedMentionList =
    props.SuggestedMentionList as React.FunctionComponent<SuggestedMentionListProps>

  return (
    <>
      <KeyboardAvoidingView
        keyboardVerticalOffset={keyboardAvoidOffset - bottom}
        behavior={KEYBOARD_AVOID_VIEW_BEHAVIOR}
      >
        <View
          style={{
            paddingLeft: left,
            paddingRight: right,
            backgroundColor: '#FFFFFFdd',
          }}
        >
          <View
            onLayout={(e): void => setInputHeight(e.nativeEvent.layout.height)}
            style={styles.inputContainer}
          >
            {inputMode === 'send' && (
              <SendInput
                {...props}
                {...chatAvailableState}
                key={GET_INPUT_KEY(mentionedUsers.length === 0)}
                ref={textInputRef as never}
                text={text}
                onChangeText={onChangeText}
                onSelectionChange={onSelectionChange}
                mentionedUsers={mentionedUsers}
                useGcInputReturn={useGcInputReturn}
              />
            )}
            {inputMode === 'edit' && messageToEdit && (
              <EditInput
                {...props}
                key={GET_INPUT_KEY(mentionedUsers.length === 0)}
                ref={textInputRef as never}
                autoFocus={AUTO_FOCUS}
                text={text}
                onChangeText={onChangeText}
                messageToEdit={messageToEdit}
                setMessageToEdit={setMessageToEdit}
                disabled={chatAvailableState.disabled}
                onSelectionChange={onSelectionChange}
                mentionedUsers={mentionedUsers}
              />
            )}
          </View>
          <View style={{ paddingHorizontal: 16 }}>
            <BottomMenu useGcInputReturn={useGcInputReturn} />
          </View>
          <SafeAreaBottom height={bottom} />
        </View>
      </KeyboardAvoidingView>
      <SelectAssetList useGcInputReturn={useGcInputReturn} />
      {mentionAvailable && (
        <SuggestedMentionList
          text={text}
          selection={selection}
          inputHeight={inputHeight}
          topInset={top}
          bottomInset={bottom}
          onPressToMention={onPressToMention}
          mentionedUsers={mentionedUsers}
        />
      )}
      <SelectReceiverModal useGcInputReturn={useGcInputReturn} />
    </>
  )
}

const useTypingTrigger = (
  text: string,
  channel: SendbirdGroupChannel
): void => {
  useEffect(() => {
    if (text.length === 0) {
      channel.endTyping()
    } else {
      channel.startTyping()
    }
  }, [text])
}

const useTextPersistenceOnDisabled = (
  text: string,
  setText: (val: string) => void,
  chatDisabled: boolean
): void => {
  const textTmpRef = useRef('')

  useEffect(() => {
    if (chatDisabled) {
      textTmpRef.current = text
      setText('')
    } else {
      setText(textTmpRef.current)
    }
  }, [chatDisabled])
}

const useAutoFocusOnEditMode = (
  textInputRef: MutableRefObject<TextInput | undefined>,
  messageToEdit?: SendbirdUserMessage | SendbirdFileMessage
): void => {
  useEffect(() => {
    if (messageToEdit?.isUserMessage()) {
      if (!AUTO_FOCUS) {
        setTimeout(() => textInputRef.current?.focus(), 500)
      }
    }
  }, [messageToEdit])
}

const SafeAreaBottom = ({ height }: { height: number }): ReactElement => {
  return <View style={{ height }} />
}

const styles = createStyleSheet({
  inputContainer: {
    justifyContent: 'center',
    width: '100%',
  },
  inputDefault: {
    height: 56,
  },
})

export default React.memo(GroupChannelInput)
