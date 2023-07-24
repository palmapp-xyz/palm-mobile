import { Routes } from 'palm-core/libs/navigation'
import { ChannelType, SbUserMetadata } from 'palm-core/types'
import { FormImage, Row } from 'palm-react-native-ui-kit/components'
import Avatar from 'palm-react-native-ui-kit/components/sendbird/Avatar'
import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import useAuth from 'palm-react/hooks/auth/useAuth'
import { SENDBIRD_STATIC_SAMPLE } from 'palm-react/hooks/page/groupChannel/useChannelInfo'
import images from 'palm-ui-kit/assets/images'
import React, { ReactElement, useContext } from 'react'
import { TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import { Member } from '@sendbird/chat/groupChannel'
import {
  GroupChannelContexts,
  GroupChannelProps,
  useLocalization,
} from '@sendbird/uikit-react-native'
import {
  Header,
  createStyleSheet,
  useHeaderStyle,
} from '@sendbird/uikit-react-native-foundation'

const GroupChannelHeader = ({
  onPressHeaderLeft,
}: GroupChannelProps['Header']): ReactElement => {
  const { user } = useAuth()
  const { navigation, params } = useAppNavigation<Routes.GroupChannel>()
  const { channel, headerTitle } = useContext(GroupChannelContexts.Fragment)
  const { typingUsers } = useContext(GroupChannelContexts.TypingIndicator)
  const { STRINGS } = useLocalization()
  const { HeaderComponent } = useHeaderStyle()
  const subtitle = STRINGS.LABELS.TYPING_INDICATOR_TYPINGS(typingUsers)

  const isMyDM = channel.customType === ChannelType.DIRECT
  const otherDMUser: Member | undefined = isMyDM
    ? channel.members.filter(
        (member: Member) => member.userId !== user?.auth?.profileId
      )[0]
    : undefined

  return (
    <HeaderComponent
      clearTitleMargin
      title={
        <View style={styles.titleContainer}>
          {otherDMUser ? (
            <TouchableOpacity
              onPress={(): void => {
                navigation.push(Routes.UserProfile, {
                  address: (otherDMUser.metaData as SbUserMetadata).address,
                  profileId: otherDMUser.userId,
                  channel: channel,
                })
              }}
            >
              <View style={styles.avatarGroup}>
                <Avatar size={36} uri={otherDMUser.profileUrl} />
              </View>
            </TouchableOpacity>
          ) : (
            channel.coverUrl &&
            !channel.coverUrl.includes(SENDBIRD_STATIC_SAMPLE) && (
              <FormImage
                source={{ uri: channel.coverUrl }}
                size={36}
                style={styles.avatarGroup}
              />
            )
          )}
          <View style={{ flexShrink: 1 }}>
            <Header.Title h2>
              {otherDMUser ? otherDMUser.nickname : headerTitle}
            </Header.Title>
            {Boolean(subtitle) && subtitle && (
              <Header.Subtitle style={styles.subtitle}>
                {subtitle}
              </Header.Subtitle>
            )}
          </View>
        </View>
      }
      left={<Icon name="chevron-back-outline" size={28} />}
      onPressLeft={onPressHeaderLeft}
      right={
        <Row style={{ columnGap: 16 }}>
          <TouchableOpacity
            onPress={(): void => {
              navigation.push(Routes.ChannelListings, params)
            }}
          >
            <FormImage source={images.NFT_black} size={28} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={(): void => {
              navigation.navigate(Routes.ChannelInfo, params)
            }}
          >
            <Icon name="menu-outline" size={28} />
          </TouchableOpacity>
        </Row>
      }
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
    marginRight: 12,
  },
  subtitle: {
    marginTop: 2,
  },
})

export default GroupChannelHeader
