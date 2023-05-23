import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { ChannelType } from 'types'

import { Member } from '@sendbird/chat/groupChannel'
import { useSendbirdChat } from '@sendbird/uikit-react-native'
import { Icon, useUIKitTheme } from '@sendbird/uikit-react-native-foundation'
import { SendbirdBaseChannel, isDefaultCoverImage } from '@sendbird/uikit-utils'

import Avatar from './Avatar'

import type { StyleProp, ViewStyle } from 'react-native'
type Props = {
  channel: SendbirdBaseChannel
  size: number
  containerStyle?: StyleProp<ViewStyle>
}

const ChannelCover = ({ channel, ...avatarProps }: Props): ReactElement => {
  const { currentUser } = useSendbirdChat()
  const { colors } = useUIKitTheme()

  if (channel.isGroupChannel()) {
    // custom channel cover
    if (!isDefaultCoverImage(channel.coverUrl) || !currentUser) {
      return <Avatar uri={channel.coverUrl} {...avatarProps} />
    }

    // broadcast channel cover
    if (channel.isBroadcast) {
      return (
        <View style={avatarProps.containerStyle}>
          <Icon
            icon={'broadcast'}
            size={avatarProps.size * (4 / 7)}
            color={colors.onBackgroundReverse01}
            containerStyle={{
              backgroundColor: colors.secondary,
              borderRadius: avatarProps.size * 0.5,
              padding: avatarProps.size * (3 / 7) * 0.5,
            }}
          />
        </View>
      )
    }

    // no members, use anonymous profile
    if (channel.memberCount <= 1) {
      return <Avatar {...avatarProps} />
    }

    // 1:1, use member profile
    if (channel.customType === ChannelType.DIRECT) {
      const otherUserProfile = channel.members.filter(
        m => m.userId !== currentUser.userId
      )?.[0]?.profileUrl
      return <Avatar uri={otherUserProfile} {...avatarProps} />
    }

    // group, use members profile
    return (
      <Avatar.Group {...avatarProps}>
        {channel.members
          .sort((a: Member, _b: Member) => (a.profileUrl ? -1 : 1))
          .map(m => (
            <Avatar key={m.userId} uri={m.profileUrl} />
          ))}
      </Avatar.Group>
    )
  }

  if (channel.isOpenChannel()) {
    // channel cover
    return <Avatar uri={channel.coverUrl} {...avatarProps} />
  }

  return <Avatar uri={channel.coverUrl} {...avatarProps} />
}

export default ChannelCover
