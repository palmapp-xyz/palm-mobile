import { Container } from 'components'
import useAuthChallenge from 'hooks/api/useAuthChallenge'
import useAuth from 'hooks/auth/useAuth'
import useReactQuery from 'hooks/complex/useReactQuery'
import useFsProfile from 'hooks/firestore/useFsProfile'
import useLens from 'hooks/lens/useLens'
import useSendbird from 'hooks/sendbird/useSendbird'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { getProfileMediaImg } from 'libs/lens'
import { recordError } from 'libs/logger'
import { Routes } from 'libs/navigation'
import { filterUndefined } from 'libs/utils'
import _ from 'lodash'
import React, { ReactElement } from 'react'
import { StyleSheet } from 'react-native'
import { useSetRecoilState } from 'recoil'
import appStore from 'store/appStore'
import { ContractAddr, FbProfile, SbUserMetadata } from 'types'

import {
  ExtendedProfile,
  ProfileMetadata,
  Search,
} from '@lens-protocol/react-native-lens-ui-kit'
import firestore from '@react-native-firebase/firestore'
import { useConnection, useSendbirdChat } from '@sendbird/uikit-react-native'
import { useAlert } from '@sendbird/uikit-react-native-foundation'
import { Maybe } from '@toruslabs/openlogin'

const LensFriendsScreen = (): ReactElement => {
  const { navigation } = useAppNavigation<Routes.LensFriends>()
  const { connect } = useConnection()
  const { user } = useAuth()
  const { fetchUserProfileId } = useAuthChallenge()
  const { createGroupChat, generateDmChannelUrl } = useSendbird()
  const { setCurrentUser, updateCurrentUserInfo } = useSendbirdChat()
  const { getDefaultProfile } = useLens()
  const { fetchProfile } = useFsProfile({})
  const { alert } = useAlert()

  const setLoading = useSetRecoilState(appStore.loading)

  const { data: lensProfile } = useReactQuery(
    ['getDefaultProfile', user?.address],
    () => getDefaultProfile(user?.address ?? '')
  )

  const createProfileFromLensProfile = async (
    profile: ExtendedProfile
  ): Promise<Maybe<FbProfile>> => {
    if (!user) {
      return undefined
    }

    const userProfileId = await fetchUserProfileId(profile.ownedBy)
    const userProfile = await fetchProfile(userProfileId!)
    const ret: FbProfile | undefined = filterUndefined<FbProfile>({
      ...userProfile!,
      bio: profile.bio || undefined,
      name: profile.name || undefined,
      handle: profile.handle,
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
        address: profile.ownedBy as ContractAddr,
      }
      await newUser.createMetaData(data)
    }
    setCurrentUser(newUser)
    const profileImg = getProfileMediaImg(profile.picture)
    await updateCurrentUserInfo(profile.handle, profileImg)

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
      const dmChannelUrl: string = generateDmChannelUrl(
        userProfile!.profileId,
        user.auth!.profileId
      )
      const channel = await createGroupChat({
        channelUrl: dmChannelUrl,
        channelName: userProfile!.handle!,
        coverImage: getProfileMediaImg(userProfile),
        isDistinct: true,
        invitedUserIds: [userProfile!.profileId!],
        operatorUserIds: [user.auth!.profileId, userProfile!.profileId!],
      })
      setLoading(false)
      setTimeout(() => {
        navigation.navigate(Routes.GroupChannel, {
          channelUrl: channel.url,
        })
      }, 200)
    } catch (e) {
      setLoading(false)
      recordError(e, 'LensFriendsScreen:goToProfileChat')
      alert({ title: 'Unknown Error', message: _.toString(e) })
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
