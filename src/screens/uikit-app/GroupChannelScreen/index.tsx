import React, { ReactElement, useEffect, useMemo } from 'react'
import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import { useQuery } from 'react-query'
import { View } from 'react-native'
import {
  createGroupChannelFragment,
  useSendbirdChat,
} from '@sendbird/uikit-react-native'

import { Routes } from 'libs/navigation'

import { ContractAddr, QueryKeyEnum } from 'types'
import GroupChannelHeader from './GroupChannelHeader'
import GroupChannelInput from './GroupChannelInput'
import GroupChannelMessageList from './GroupChannelMessageList'
import { MessageRenderer } from 'components'
import useFsChannel from 'hooks/firestore/useFsChannel'
import useNft from 'hooks/contract/useNft'
import useAuth from 'hooks/independent/useAuth'
import { useAppNavigation } from 'hooks/useAppNavigation'

const GroupChannelFragment = createGroupChannelFragment({
  Input: GroupChannelInput,
  Header: GroupChannelHeader,
  MessageList: GroupChannelMessageList,
})

const HasGatingToken = ({
  gatingToken,
}: {
  gatingToken: ContractAddr
}): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannel>()

  const { user } = useAuth()
  const { balanceOf } = useNft({ nftContract: gatingToken })
  const { data: balance } = useQuery(
    [QueryKeyEnum.NFT_TOKEN_BALANCE_OF],
    async () => {
      if (user) {
        return balanceOf({ owner: user.address })
      }
    }
  )

  useEffect(() => {
    if (balance === '0') {
      navigation.replace(Routes.TokenGatingInfo, {
        channelUrl: params.channelUrl,
        gatingToken,
      })
    }
  }, [balance])

  return <View />
}

const GroupChannelScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannel>()
  const { sdk } = useSendbirdChat()

  const { channel } = useGroupChannel(sdk, params.channelUrl)

  const { fsChannelField } = useFsChannel({ channelUrl: params.channelUrl })
  const gatingToken = useMemo(
    () => fsChannelField?.gatingToken,
    [fsChannelField]
  )

  if (!channel || !fsChannelField) {
    return <></>
  }

  return (
    <>
      {gatingToken && <HasGatingToken gatingToken={gatingToken} />}
      <GroupChannelFragment
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
        onPressHeaderLeft={(): void => {
          // Navigate back
          navigation.goBack()
        }}
        onPressHeaderRight={(): void => {
          // Navigate to group channel settings
          navigation.push(Routes.GroupChannelSettings, params)
        }}
        renderMessage={(props): ReactElement | null => (
          <MessageRenderer {...props} />
        )}
      />
    </>
  )
}

export default GroupChannelScreen
