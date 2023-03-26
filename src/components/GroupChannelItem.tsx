import React, { ReactElement } from 'react'

import { useSendbirdChat } from '@sendbird/uikit-react-native'
import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { COLOR } from 'consts'

const GroupChannelItem = ({
  channelUrl,
}: {
  channelUrl?: string
}): ReactElement => {
  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, channelUrl ?? '')
  const { navigation } = useAppNavigation<Routes.GroupChannelList>()

  if (!channel) {
    return <></>
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={(): void => {
        if (!channelUrl || !channel) {
          return
        }
        navigation.navigate(Routes.GroupChannel, { channelUrl })
      }}>
      <Text>{channel.url}</Text>
    </TouchableOpacity>
  )
}

export default GroupChannelItem

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: COLOR.primary._100,
    borderWidth: 2,
    borderColor: COLOR.gray._400,
  },
})
