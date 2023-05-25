import { MessageRenderer } from 'components'
import ChannelGatingChecker from 'components/ChannelGatingChecker'
import useFsChannel from 'hooks/firestore/useFsChannel'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import React, { ReactElement, useCallback, useMemo } from 'react'
import { AvoidSoftInput } from 'react-native-avoid-softinput'

import { useFocusEffect } from '@react-navigation/native'
import { GroupChannel } from '@sendbird/chat/groupChannel'
import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import {
  createGroupChannelFragment,
  useSendbirdChat,
} from '@sendbird/uikit-react-native'

import GroupChannelHeader from './GroupChannelHeader'
import GroupChannelInput from './GroupChannelInput'

const GroupChannelFragment = createGroupChannelFragment({
  Input: GroupChannelInput,
  Header: GroupChannelHeader,
})

const HasGatingToken = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannel>()

  return (
    <ChannelGatingChecker
      channelUrl={params.channelUrl}
      onCompleteCheck={({ accessible }): void => {
        if (accessible === false) {
          navigation.replace(Routes.TokenGatingInfo, {
            channelUrl: params.channelUrl,
          })
        }
      }}
    />
  )
}

const Contents = ({ channel }: { channel: GroupChannel }): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannel>()

  const onFocusEffect = useCallback(() => {
    AvoidSoftInput.setAdjustNothing()
    AvoidSoftInput.setEnabled(true)
    return () => {
      AvoidSoftInput.setEnabled(false)
      AvoidSoftInput.setDefaultAppSoftInputMode()
    }
  }, [])

  useFocusEffect(onFocusEffect)

  return (
    <GroupChannelFragment
      keyboardAvoidOffset={-280}
      enableTypingIndicator={true}
      channel={channel}
      onPressMediaMessage={(fileMessage, deleteMessage): void => {
        // Navigate to media viewer
        navigation.navigate(Routes.FileViewer, {
          serializedFileMessage: fileMessage.serialize(),
          deleteMessage,
        })
      }}
      onChannelDeleted={(): void => {
        // Should leave channel, navigate to channel list
        navigation.navigate(Routes.GroupChannelList)
      }}
      onPressHeaderLeft={(): void => navigation.goBack()}
      onPressHeaderRight={(): void => {
        // Navigate to group channel settings
        navigation.push(Routes.GroupChannelSettings, params)
      }}
      renderMessage={(props): ReactElement | null => (
        <MessageRenderer {...props} />
      )}
    />
  )
}

const GroupChannelScreen = (): ReactElement => {
  const { params } = useAppNavigation<Routes.GroupChannel>()
  const { sdk } = useSendbirdChat()

  const { channel } = useGroupChannel(sdk, params.channelUrl)

  const { fsChannel, fsChannelField } = useFsChannel({
    channelUrl: params.channelUrl,
  })
  const gating = useMemo(() => fsChannelField?.gating, [fsChannelField])

  if (!channel || !fsChannel || !fsChannelField) {
    return <></>
  }

  return (
    <>
      {channel.myRole !== 'operator' && gating?.amount && <HasGatingToken />}
      <Contents channel={channel} />
    </>
  )
}

export default GroupChannelScreen
