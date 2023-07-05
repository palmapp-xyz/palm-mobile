import { Routes } from 'palm-core/libs/navigation'
import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import React, { ReactElement } from 'react'

import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import {
  createGroupChannelRegisterOperatorFragment,
  useSendbirdChat,
} from '@sendbird/uikit-react-native'

const GroupChannelRegisterOperatorFragment =
  createGroupChannelRegisterOperatorFragment()
const GroupChannelRegisterOperatorScreen = (): ReactElement => {
  const { navigation, params } =
    useAppNavigation<Routes.GroupChannelRegisterOperator>()

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, params.channelUrl)
  if (!channel) {
    return <></>
  }

  return (
    <GroupChannelRegisterOperatorFragment
      channel={channel}
      onPressHeaderLeft={(): void => {
        // Navigate back
        navigation.goBack()
      }}
      onPressHeaderRight={(): void => {
        // Navigate to group channel operators
        navigation.navigate(Routes.GroupChannelOperators, params)
      }}
    />
  )
}

export default GroupChannelRegisterOperatorScreen
