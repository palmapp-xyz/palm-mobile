import React, { ReactElement } from 'react'
import { StyleSheet } from 'react-native'

import { Container } from 'components'

import {
  ExtendedProfile,
  ProfileMetadata,
  Search,
} from '@lens-protocol/react-native-lens-ui-kit'
import { Routes } from 'libs/navigation'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { useConnection, useSendbirdChat } from '@sendbird/uikit-react-native'
import useAuth from 'hooks/independent/useAuth'
import useSendbird from 'hooks/sendbird/useSendbird'
import { GroupChannel } from '@sendbird/chat/groupChannel'
import useLens from 'hooks/independent/useLens'
import { getProfileImgFromLensProfile } from 'libs/lens'
import useReactQuery from 'hooks/complex/useReactQuery'

const LensFriendsScreen = (): ReactElement => {
  const { navigation } = useAppNavigation<Routes.LensFriends>()
  const { connect } = useConnection()
  const { user } = useAuth()
  const { createGroupChatIfNotExist } = useSendbird()
  const { updateCurrentUserInfo } = useSendbirdChat()
  const { getDefaultProfile } = useLens()

  const { data: lensProfile } = useReactQuery(
    ['getDefaultProfile', user?.address],
    () => getDefaultProfile(user?.address ?? '')
  )

  const createSendbirdUserFromProfile = async (
    profile: ExtendedProfile
  ): Promise<void> => {
    if (!user) {
      return
    }
    await connect(profile.ownedBy)
    const profileImg = await getProfileImgFromLensProfile(profile)
    await updateCurrentUserInfo(profile.handle, profileImg)
    await connect(user?.address)
  }

  const goToProfileChat = async (profile: ExtendedProfile): Promise<void> => {
    if (!user) {
      return
    }
    try {
      await createSendbirdUserFromProfile(profile)
      await createGroupChatIfNotExist(
        profile.ownedBy,
        [user?.address],
        (channel: GroupChannel) =>
          navigation.navigate(Routes.GroupChannel, {
            channelUrl: channel.url,
          })
      )
    } catch (e) {
      console.error(e)
    }
  }

  const onFollowPress = async (
    profile: ExtendedProfile,
    _profiles: ExtendedProfile[]
  ): Promise<void> => {
    await goToProfileChat(profile)
  }
  const onProfilePress = async (
    profile: ExtendedProfile
  ): Promise<ExtendedProfile> => {
    await goToProfileChat(profile)
    return profile
  }

  const props = {
    onFollowPress,
    onProfilePress,
    signedInUser: lensProfile
      ? (lensProfile as unknown as ProfileMetadata)
      : undefined,
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
