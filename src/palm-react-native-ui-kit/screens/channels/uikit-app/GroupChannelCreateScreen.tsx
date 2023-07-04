import { Routes } from 'palm-core/libs/navigation'
import React, { ReactElement } from 'react'

import { createGroupChannelCreateFragment } from '@sendbird/uikit-react-native'

import { useAppNavigation } from '../../../../palm-react/hooks/useAppNavigation'

import type { SendbirdUser } from '@sendbird/uikit-utils'

const GroupChannelCreateFragment =
  createGroupChannelCreateFragment<SendbirdUser>()

const GroupChannelCreateScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannelCreate>()

  return (
    <GroupChannelCreateFragment
      channelType={params.channelType}
      onCreateChannel={(channel): void => {
        // Navigate to created group channel
        navigation.replace(Routes.GroupChannel, { channelUrl: channel.url })
      }}
      onPressHeaderLeft={(): void => {
        // Navigate back
        navigation.goBack()
      }}
    />
  )
}

export default GroupChannelCreateScreen
