import { Routes } from 'palm-core/libs/navigation'
import React, { ReactElement } from 'react'

import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import {
  createGroupChannelOperatorsFragment,
  useSendbirdChat,
} from '@sendbird/uikit-react-native'

import { useAppNavigation } from '../../../../palm-react/hooks/useAppNavigation'

const GroupChannelOperatorsFragment = createGroupChannelOperatorsFragment()
const GroupChannelOperatorsScreen = (): ReactElement => {
  const { navigation, params } =
    useAppNavigation<Routes.GroupChannelOperators>()

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, params.channelUrl)
  if (!channel) {
    return <></>
  }

  return (
    <GroupChannelOperatorsFragment
      channel={channel}
      onPressHeaderLeft={(): void => {
        // Navigate back
        navigation.goBack()
      }}
      onPressHeaderRight={(): void => {
        // Navigate to group channel set as operators
        navigation.navigate(Routes.GroupChannelRegisterOperator, params)
      }}
    />
  )
}

export default GroupChannelOperatorsScreen
