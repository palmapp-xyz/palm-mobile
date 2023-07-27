import { COLOR } from 'palm-core/consts'
import { getProfileMediaImg } from 'palm-core/libs/lens'
import { recordError } from 'palm-core/libs/logger'
import { Routes } from 'palm-core/libs/navigation'
import { ChannelType } from 'palm-core/types'
import { FormText } from 'palm-react-native-ui-kit/components'
import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import useAuth from 'palm-react/hooks/auth/useAuth'
import useProfile from 'palm-react/hooks/auth/useProfile'
import useSendbird from 'palm-react/hooks/sendbird/useSendbird'
import appStore from 'palm-react/store/appStore'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useSetRecoilState } from 'recoil'

import { GroupChannel } from '@sendbird/chat/groupChannel'
import { useAlert } from '@sendbird/uikit-react-native-foundation'

export type ProfileHeaderChatButtonProps = {
  userProfileId: string | undefined
}

const ProfileHeaderChatButton = React.memo(
  ({ userProfileId }: ProfileHeaderChatButtonProps): ReactElement => {
    const { navigation } = useAppNavigation()
    const { user } = useAuth()
    const { alert } = useAlert()
    const { t } = useTranslation()

    const { profile: userProfile } = useProfile({ profileId: userProfileId! })

    const { createGroupChat, getDistinctChatWithUser } = useSendbird()

    const setLoading = useSetRecoilState(appStore.loading)

    const onPress = async (): Promise<void> => {
      if (!user || !userProfile) {
        return
      }

      setLoading(true)

      try {
        let channel: GroupChannel | undefined = await getDistinctChatWithUser({
          userProfileId: userProfileId!,
        })

        if (!channel) {
          channel = await createGroupChat({
            channelName: userProfile!.handle!,
            coverImage: getProfileMediaImg(userProfile),
            invitedUserIds: [userProfile!.profileId],
            operatorUserIds: [],
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
        recordError(e, 'ProfileHeaderChatButton:onPress')
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
            font={'SB'}
            color={COLOR.black._300}
            style={{ textAlign: 'center' }}
          >
            {t('Components.ProfileHeaderChatButton.OneOnOneChat')}
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
