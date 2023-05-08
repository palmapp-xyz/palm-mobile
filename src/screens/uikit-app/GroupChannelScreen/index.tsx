import { MessageRenderer } from 'components'
import ChannelGatingChecker from 'components/ChannelGatingChecker'
import useFsChannel from 'hooks/firestore/useFsChannel'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import React, { ReactElement, useCallback, useEffect, useMemo } from 'react'
import { BackHandler, Platform } from 'react-native'
import { AvoidSoftInput } from 'react-native-avoid-softinput'

import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { useFocusEffect } from '@react-navigation/native'
import { GroupChannel } from '@sendbird/chat/groupChannel'
import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import {
  createGroupChannelFragment,
  useSendbirdChat,
} from '@sendbird/uikit-react-native'

import GroupChannelHeader from './GroupChannelHeader'
import GroupChannelInput from './GroupChannelInput'
import GroupChannelMessageList from './GroupChannelMessageList'

import type { SendbirdChatSDK } from '@sendbird/uikit-utils'
const GroupChannelFragment = createGroupChannelFragment({
  Input: GroupChannelInput,
  Header: GroupChannelHeader,
  MessageList: GroupChannelMessageList,
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

const Contents = ({
  channel,
  sdk,
  fsChannel,
}: {
  channel: GroupChannel
  sdk: SendbirdChatSDK
  fsChannel: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>
}): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannel>()

  const channelLeave = async (): Promise<boolean> => {
    // if there is no message in channel
    if (!channel.lastMessage) {
      await channel.leave()
      await sdk.clearCachedMessages([channel.url]).catch()
      await fsChannel.delete()
      return true
    }
    return false
  }

  const backAction = (): boolean => {
    channelLeave().then(res => {
      if (res === false) {
        navigation.goBack()
      }
    })
    return true
  }

  useEffect(() => {
    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      )

      return () => {
        backHandler.remove()
      }
    } else {
      navigation.addListener('beforeRemove', channelLeave)

      return () => {
        navigation.removeListener('beforeRemove', channelLeave)
      }
    }
  }, [])

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
      onPressHeaderLeft={backAction}
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

  useEffect(() => {
    if (channel && channel.myMemberState === 'none') {
      channel.join()
    }
  }, [!!channel])

  if (!channel || !fsChannel || !fsChannelField) {
    return <></>
  }

  return (
    <>
      {channel.myRole !== 'operator' && gating?.amount && <HasGatingToken />}
      <Contents channel={channel} sdk={sdk} fsChannel={fsChannel} />
    </>
  )
}

export default GroupChannelScreen
