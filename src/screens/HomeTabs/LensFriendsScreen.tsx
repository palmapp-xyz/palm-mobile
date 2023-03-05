import React, { ReactElement } from 'react'
import { StyleSheet } from 'react-native'

import { Container } from 'components'

import {
  ExtendedProfile,
  Search,
} from '@lens-protocol/react-native-lens-ui-kit'
import { Routes } from 'libs/navigation'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { useConnection } from '@sendbird/uikit-react-native'
import useAuth from 'hooks/independent/useAuth'
import useSendbird from 'hooks/sendbird/useSendbird'
import { GroupChannel } from '@sendbird/chat/groupChannel'

const LensFriendsScreen = (): ReactElement => {
  const { navigation } = useAppNavigation<Routes.LensFriends>()
  const { connect } = useConnection()
  const { user } = useAuth()
  const { createGroupChatIfNotExist } = useSendbird()

  const goToProfileChat = async (
    channelUrl: string,
    nickname?: string | null
  ): Promise<void> => {
    if (user) {
      connect(channelUrl, { nickname: nickname || undefined })
        .then(() => {
          connect(user?.address)
            .then(() => {
              createGroupChatIfNotExist(
                channelUrl,
                [user?.address],
                (channel: GroupChannel) =>
                  navigation.navigate(Routes.GroupChannel, {
                    channelUrl: channel.url,
                  })
              )
            })
            .catch(e => console.error(e))
        })
        .catch(e => console.error(e))
    }
  }

  const onFollowPress = async (
    profile: ExtendedProfile,
    _profiles: ExtendedProfile[]
  ): Promise<void> => {
    await goToProfileChat(profile.ownedBy, profile.name)
  }
  const onProfilePress = async (
    profile: ExtendedProfile
  ): Promise<ExtendedProfile> => {
    await goToProfileChat(profile.ownedBy, profile.name)
    return profile
  }

  const props = {
    onFollowPress,
    onProfilePress,
  }

  return (
    <Container style={styles.container}>
      <Search {...props} />
    </Container>
  )
}

export default LensFriendsScreen

const styles = StyleSheet.create({
  container: {},
})
