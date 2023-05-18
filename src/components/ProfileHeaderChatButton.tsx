import { FormText } from 'components'
import { COLOR } from 'consts'
import useAuth from 'hooks/auth/useAuth'
import useProfile from 'hooks/auth/useProfile'
import useSendbird from 'hooks/sendbird/useSendbird'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { getProfileMediaImg } from 'libs/lens'
import { recordError } from 'libs/logger'
import { Routes } from 'libs/navigation'
import React, { ReactElement } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useSetRecoilState } from 'recoil'
import appStore from 'store/appStore'
import { ChannelType } from 'types'

import { useAlert } from '@sendbird/uikit-react-native-foundation'

export type ProfileHeaderChatButtonProps = {
  userProfileId: string | undefined
}

const ProfileHeaderChatButton = React.memo(
  ({ userProfileId }: ProfileHeaderChatButtonProps): ReactElement => {
    const { navigation } = useAppNavigation()
    const { user } = useAuth()
    const { alert } = useAlert()

    const { profile: userProfile } = useProfile({ profileId: userProfileId })

    const { createGroupChat, generateDmChannelUrl } = useSendbird()

    const setLoading = useSetRecoilState(appStore.loading)

    const onPress = async (): Promise<void> => {
      if (!user || !userProfile) {
        return
      }

      setLoading(true)

      try {
        const dmChannelUrl: string = generateDmChannelUrl(
          userProfileId,
          user!.auth!.profileId
        )
        const channel = await createGroupChat({
          channelUrl: dmChannelUrl,
          channelName: userProfile!.handle!,
          coverImage: getProfileMediaImg(userProfile),
          isDistinct: true,
          invitedUserIds: [userProfileId!],
          operatorUserIds: [user!.auth!.profileId, userProfile.profileId!],
          channelType: ChannelType.DIRECT,
        })

        setLoading(false)
        setTimeout(() => {
          navigation.navigate(Routes.GroupChannel, {
            channelUrl: channel.url,
          })
        }, 200)
      } catch (e) {
        setLoading(false)
        recordError(e, '')
        alert({ message: e instanceof Error ? e.message : JSON.stringify(e) })
      }
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity
          disabled={!user || !userProfile}
          style={styles.button}
          onPress={onPress}
        >
          <FormText
            fontType="SB.14"
            color={COLOR.black._300}
            style={{ textAlign: 'center' }}
          >
            1:1 Chat
          </FormText>
        </TouchableOpacity>
      </View>
    )
  }
)

export default ProfileHeaderChatButton

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLOR.black._100,
    borderRadius: 16,
  },
})
