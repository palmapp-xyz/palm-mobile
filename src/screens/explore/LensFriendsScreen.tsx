import { Container } from 'components'
import LoadingPage from 'components/atoms/LoadingPage'
import { getFsProfile } from 'core/libs/firebase'
import { getProfileMediaImg } from 'core/libs/lens'
import { recordError } from 'core/libs/logger'
import { Routes } from 'core/libs/navigation'
import { filterUndefined } from 'core/libs/utils'
import appStore from 'core/store/appStore'
import {
  ChannelType,
  ContractAddr,
  FbProfile,
  SbUserMetadata,
} from 'core/types'
import useAuthChallenge from 'hooks/api/useAuthChallenge'
import useAuth from 'hooks/auth/useAuth'
import useProfile from 'hooks/auth/useProfile'
import useIpfs from 'hooks/complex/useIpfs'
import useSendbird from 'hooks/sendbird/useSendbird'
import { useAppNavigation } from 'hooks/useAppNavigation'
import React, { ReactElement } from 'react'
import { StyleSheet } from 'react-native'
import { useSetRecoilState } from 'recoil'

import {
  ExtendedProfile,
  ProfileMetadata,
  Search,
} from '@lens-protocol/react-native-lens-ui-kit'
import firestore from '@react-native-firebase/firestore'
import { GroupChannel } from '@sendbird/chat/groupChannel'
import { useConnection, useSendbirdChat } from '@sendbird/uikit-react-native'
import { useAlert } from '@sendbird/uikit-react-native-foundation'
import { Maybe } from '@toruslabs/openlogin'

const LensFriendsScreen = (): ReactElement => {
  const { navigation } = useAppNavigation<Routes.LensFriends>()
  const { connect } = useConnection()
  const { user } = useAuth()
  const { fetchUserProfileId } = useAuthChallenge()
  const { createGroupChat, getDistinctChatWithUser } = useSendbird()
  const { setCurrentUser, updateCurrentUserInfo } = useSendbirdChat()
  const { alert } = useAlert()

  const setLoading = useSetRecoilState(appStore.loading)

  const { lensProfile } = useProfile({ profileId: user?.auth?.profileId })
  const { data: profileMetadata, loading } = useIpfs<ProfileMetadata>({
    uri: lensProfile?.metadata,
  })

  if (loading) {
    return <LoadingPage />
  }

  const createProfileFromLensProfile = async (
    profile: ExtendedProfile
  ): Promise<Maybe<FbProfile>> => {
    if (!user) {
      return undefined
    }

    const userProfileId = await fetchUserProfileId(profile.ownedBy)
    const userProfile = await getFsProfile(userProfileId!)
    const ret: FbProfile | undefined = filterUndefined<FbProfile>({
      ...userProfile!,
      bio: profile.bio || undefined,
      name: profile.name || undefined,
      handle: profile.handle,
      address: profile.ownedBy as ContractAddr,
      picture: profile.picture || undefined,
      coverPicture: getProfileMediaImg(profile.coverPicture),
      attributes: profile.attributes || undefined,
    })
    // not a palm user yet. populate with lens profile info for him/her
    if (ret && !userProfile!.handle) {
      await firestore()
        .collection('profiles')
        .doc(userProfileId)
        .set(ret, { merge: true })
    }

    // create sendbird user by connecting
    const newUser = await connect(userProfileId!)
    if (!(newUser.metaData as SbUserMetadata).address) {
      const data: SbUserMetadata = {
        address: ret.address,
        handle: ret.handle,
        profileId: ret.profileId,
      }
      await newUser.createMetaData(data)
    }
    setCurrentUser(newUser)
    const profileImg = getProfileMediaImg(profile.picture)
    await updateCurrentUserInfo(ret.handle, profileImg)

    // reconnect back to self
    const me = await connect(user.auth!.profileId)
    setCurrentUser(me)

    return ret
  }

  const goToProfileChat = async (profile: ExtendedProfile): Promise<void> => {
    if (!user) {
      return
    }

    setLoading(true)
    try {
      const userProfile = await createProfileFromLensProfile(profile)
      if (!userProfile) {
        throw new Error(`Failed to start 1:1 chat with user ${profile.handle}`)
      }

      let channel: GroupChannel | undefined = await getDistinctChatWithUser({
        userProfileId: userProfile.profileId!,
      })

      if (!channel) {
        channel = await createGroupChat({
          channelName: userProfile.handle!,
          coverImage: getProfileMediaImg(userProfile),
          invitedUserIds: [userProfile.profileId!],
          operatorUserIds: [user!.auth!.profileId, userProfile.profileId!],
          channelType: ChannelType.DIRECT,
        })
      }

      if (!channel) {
        throw new Error(
          `Failed to start 1:1 chat with user ${userProfile.handle}`
        )
      }

      setLoading(false)
      setTimeout(() => {
        navigation.push(Routes.GroupChannel, {
          channelUrl: channel!.url,
        })
      }, 200)
    } catch (e) {
      setLoading(false)
      recordError(e, 'LensFriendsScreen:goToProfileChat')
      alert({ message: e instanceof Error ? e.message : JSON.stringify(e) })
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
    signedInUser: profileMetadata ? profileMetadata : undefined,
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
