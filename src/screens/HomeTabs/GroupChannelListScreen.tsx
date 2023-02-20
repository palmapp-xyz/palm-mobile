import React, { ReactElement, useEffect } from 'react'

import { createGroupChannelListFragment } from '@sendbird/uikit-react-native'

import { Routes } from 'libs/navigation'
import { useAppNavigation } from 'hooks/useAppNavigation'

const GroupChannelListFragment = createGroupChannelListFragment()
const GroupChannelListScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannelList>()

  useEffect(() => {
    setTimeout(() => {
      if (params?.channelUrl) {
        navigation.navigate(Routes.GroupChannel, {
          channelUrl: params.channelUrl,
        })
      }
    }, 500)
  }, [params?.channelUrl])

  return (
    <GroupChannelListFragment
      onPressCreateChannel={(channelType): void => {
        navigation.navigate(Routes.GroupChannelCreate, { channelType })
      }}
      onPressChannel={(channel): void => {
        navigation.navigate(Routes.GroupChannel, { channelUrl: channel.url })
      }}
    />
  )
}

export default GroupChannelListScreen
