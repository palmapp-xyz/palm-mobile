import React, { ReactElement } from 'react'
import { StyleSheet } from 'react-native'

import { Container } from 'components'

import {
  ExtendedProfile,
  Search,
} from '@lens-protocol/react-native-lens-ui-kit'
import { Routes } from 'libs/navigation'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { useSendbirdChat } from '@sendbird/uikit-react-native'

const LensFriendsScreen = (): ReactElement => {
  const { navigation } = useAppNavigation<Routes.LensFriends>()
  const { sdk } = useSendbirdChat()

  const goToProfileChat = async (channelUrl: string): Promise<void> => {
    try {
      const channel = await sdk.groupChannel.getChannel(channelUrl)
      if (channel) {
        navigation.navigate(Routes.GroupChannel, { channelUrl })
      }
    } catch (e) {
      console.error(e)
    }
  }

  const onFollowPress = async (
    profile: ExtendedProfile,
    _profiles: ExtendedProfile[]
  ): Promise<void> => {
    await goToProfileChat(profile.ownedBy)
  }
  const onProfilePress = async (
    profile: ExtendedProfile
  ): Promise<ExtendedProfile> => {
    await goToProfileChat(profile.ownedBy)
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
