import React, { ReactElement, useContext } from 'react'
import { TouchableNativeFeedback, TouchableOpacity, View } from 'react-native'

import {
  Header,
  Icon,
  createStyleSheet,
  useHeaderStyle,
} from '@sendbird/uikit-react-native-foundation'
import {
  GroupChannelProps,
  GroupChannelContexts,
  useLocalization,
  ChannelCover,
} from '@sendbird/uikit-react-native'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import { getProfileImgFromLensProfile } from 'libs/lens'
import useLens from 'hooks/independent/useLens'
import useAuth from 'hooks/independent/useAuth'
import { ExtendedProfile } from '@lens-protocol/react-native-lens-ui-kit'
import useReactQuery from 'hooks/complex/useReactQuery'

const GroupChannelHeader = ({
  onPressHeaderLeft,
  onPressHeaderRight,
}: GroupChannelProps['Header']): ReactElement => {
  const { headerTitle, channel } = useContext(GroupChannelContexts.Fragment)
  const { typingUsers } = useContext(GroupChannelContexts.TypingIndicator)
  const { STRINGS } = useLocalization()
  const { HeaderComponent } = useHeaderStyle()
  const subtitle = STRINGS.LABELS.TYPING_INDICATOR_TYPINGS(typingUsers)
  const { navigation } = useAppNavigation<Routes.GroupChannel>()
  const { getDefaultProfile } = useLens()
  const { user } = useAuth()

  const userId = channel.members.find(
    member => member.userId !== user?.address
  )?.userId
  const { data } = useReactQuery(['getDefaultProfile', userId], () =>
    getDefaultProfile(userId || '')
  )

  return (
    <HeaderComponent
      clearTitleMargin
      title={
        <View style={styles.titleContainer}>
          <TouchableOpacity
            onPress={async (): Promise<void> => {
              if (!data) {
                return
              }
              const profile = data.defaultProfile as unknown as ExtendedProfile
              const profileImg = await getProfileImgFromLensProfile(profile)
              navigation.navigate(Routes.UserProfile, {
                address: profile.ownedBy,
                plainProfileUrl: profileImg,
                nickName: profile.handle,
              })
            }}>
            <ChannelCover
              channel={channel}
              size={34}
              containerStyle={styles.avatarGroup}
            />
          </TouchableOpacity>
          <View style={{ flexShrink: 1 }}>
            <Header.Title h2>{headerTitle}</Header.Title>
            {Boolean(subtitle) && subtitle && (
              <Header.Subtitle style={styles.subtitle}>
                {subtitle}
              </Header.Subtitle>
            )}
          </View>
        </View>
      }
      left={<Icon icon={'arrow-left'} />}
      onPressLeft={onPressHeaderLeft}
      right={<Icon icon={'info'} />}
      onPressRight={onPressHeaderRight}
    />
  )
}

const styles = createStyleSheet({
  titleContainer: {
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarGroup: {
    marginRight: 8,
  },
  subtitle: {
    marginTop: 2,
  },
})

export default GroupChannelHeader
