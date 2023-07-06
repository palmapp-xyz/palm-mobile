import { COLOR } from 'palm-core/consts'
import { Routes } from 'palm-core/libs/navigation'
import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import React, { ReactElement } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import { useSendbirdChat } from '@sendbird/uikit-react-native'

import FormText from './atoms/FormText'

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
        navigation.push(Routes.GroupChannel, { channelUrl })
      }}
    >
      <FormText>{channel.url}</FormText>
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
    borderColor: COLOR.black._400,
  },
})
