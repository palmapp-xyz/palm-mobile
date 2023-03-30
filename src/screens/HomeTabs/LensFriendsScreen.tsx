import React, { ReactElement } from 'react'
import { StyleSheet } from 'react-native'

import { Container } from 'components'

import {
  ExtendedProfile,
  ProfileMetadata,
  Search,
} from '@lens-protocol/react-native-lens-ui-kit'
import firestore from '@react-native-firebase/firestore'
import { Routes } from 'libs/navigation'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { useConnection, useSendbirdChat } from '@sendbird/uikit-react-native'
import useAuth from 'hooks/independent/useAuth'
import useSendbird from 'hooks/sendbird/useSendbird'
import { GroupChannel } from '@sendbird/chat/groupChannel'
import useLens from 'hooks/lens/useLens'
import { getProfileImgFromProfile } from 'libs/lens'
import useReactQuery from 'hooks/complex/useReactQuery'
import { Profile } from 'graphqls/__generated__/graphql'
import { ContractAddr, User } from 'types'
import { useSetRecoilState } from 'recoil'
import appStore from 'store/appStore'

const LensFriendsScreen = (): ReactElement => {
  const { navigation } = useAppNavigation<Routes.LensFriends>()
  const { connect } = useConnection()
  const { user } = useAuth()
  const { createGroupChatIfNotExist, generateDmChannelUrl } = useSendbird()
  const { setCurrentUser, updateCurrentUserInfo } = useSendbirdChat()
  const { getDefaultProfile } = useLens()

  const setLoading = useSetRecoilState(appStore.loading)

  const { data: lensProfile } = useReactQuery(
    ['getDefaultProfile', user?.address],
    () => getDefaultProfile(user?.address ?? '')
  )

  const createUserFromProfile = async (
    profile: ExtendedProfile
  ): Promise<void> => {
    if (!user) {
      return
    }

    const fsProfile = firestore().collection('profiles').doc(profile.ownedBy)
    const fsProfileDoc = await fsProfile.get()

    let fsUser: User = {
      address: profile.ownedBy as ContractAddr,
      lensProfile: profile as Profile,
      ...(profile as Profile),
    }

    if (!fsProfileDoc.exists) {
      await fsProfile.set(fsUser)
    } else {
      fsUser = (await fsProfileDoc.data()) as User
    }

    // create sendbird user by connecting
    const newUser = await connect(profile.ownedBy)
    setCurrentUser(newUser)
    const profileImg = getProfileImgFromProfile(profile)
    await updateCurrentUserInfo(profile.handle, profileImg)

    // reconnect back to self
    const me = await connect(user?.address)
    setCurrentUser(me)
  }

  const goToProfileChat = async (profile: ExtendedProfile): Promise<void> => {
    if (!user) {
      return
    }

    setLoading(true)
    setTimeout(async () => {
      try {
        await createUserFromProfile(profile)
        await createGroupChatIfNotExist({
          channelUrl: generateDmChannelUrl(profile.ownedBy, user?.address),
          invitedUserIds: [profile.ownedBy],
          operatorUserIds: [user?.address, profile.ownedBy],
          onChannelCreated: (channel: GroupChannel) => {
            setLoading(false)
            setTimeout(() => {
              navigation.navigate(Routes.GroupChannel, {
                channelUrl: channel.url,
              })
            }, 200)
          },
        })
      } catch (e) {
        console.error(e)
      }
    }, 200)
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
