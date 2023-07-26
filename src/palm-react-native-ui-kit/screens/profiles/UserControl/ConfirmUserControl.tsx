import { useProfile } from '@lens-protocol/react'
import { GroupChannel } from '@sendbird/chat/groupChannel'
import { COLOR } from 'palm-core/consts'
import { Routes } from 'palm-core/libs/navigation'
import {
  FormButton,
  FormText,
  ViewHorizontalDivider,
} from 'palm-react-native-ui-kit/components'
import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import useToast from 'palm-react-native/app/useToast'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'
import SimpleUserProfile from './SimpleUserProfile'

const ConfirmUserControl = React.memo(
  ({
    controlType,
    profileId,
    channel,
    setShowChannelUserControl,
  }: {
    controlType?: 'ban' | 'mute'
    profileId: string
    channel: GroupChannel | undefined
    setShowChannelUserControl: React.Dispatch<React.SetStateAction<boolean>>
  }): ReactElement => {
    const { navigation } = useAppNavigation<Routes.UserProfile>()
    const toast = useToast()
    const { t } = useTranslation()
    const { profile } = useProfile({ profileId })

    const banUser = (): void => {
      channel
        ?.banUserWithUserId(profileId)
        .then(() => {
          toast.show(
            t('UserProfile.BanToast', {
              user: profile?.handle,
            }),
            {
              icon: 'check',
              color: 'green',
            }
          )
          setShowChannelUserControl(false)
          navigation.pop()
        })
        .catch(err => {
          toast.show(`${err}`, { icon: 'info', color: 'red' })
        })
    }

    const muteUser = (): void => {
      channel
        ?.muteUserWithUserId(profileId)
        .then(() => {
          toast.show(
            t('UserProfile.MuteToast', {
              user: profile?.handle,
            }),
            {
              icon: 'check',
              color: 'green',
            }
          )
          setShowChannelUserControl(false)
          navigation.pop()
        })
        .catch(err => {
          toast.show(`${err}`, { icon: 'info', color: 'red' })
        })
    }

    return (
      <View>
        <View style={{ marginHorizontal: 20 }}>
          <FormText
            size={24}
            font="B"
            color={COLOR.black._900}
            style={{ marginBottom: 8 }}
          >
            {t('UserProfile.AreYouSureThisUser', {
              type: controlType === 'ban' ? 'ban' : 'mute',
            })}
          </FormText>
          <FormText color={COLOR.black._400} style={{ marginBottom: 40 }}>
            {controlType === 'ban'
              ? t('UserProfile.BanWarning')
              : t('UserProfile.MuteWarning')}
          </FormText>
          <SimpleUserProfile profile={profile} />
        </View>
        <ViewHorizontalDivider />
        <FormButton
          font="SB"
          containerStyle={{
            borderColor: controlType === 'ban' ? COLOR.red : COLOR.primary._400,
            backgroundColor:
              controlType === 'ban' ? COLOR.red : COLOR.primary._400,
            marginHorizontal: 20,
            marginTop: 12,
            marginBottom: Platform.select({ android: 20 }),
          }}
          onPress={(): void => {
            controlType === 'ban' ? banUser() : muteUser()
          }}
        >
          {controlType === 'ban'
            ? t('UserProfile.BanButton')
            : t('UserProfile.MuteButton')}
        </FormButton>
      </View>
    )
  }
)

export default ConfirmUserControl
