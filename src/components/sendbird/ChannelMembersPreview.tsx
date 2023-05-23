import { FormText, Row } from 'components'
import { COLOR } from 'consts'
import useChannelInfo from 'hooks/page/groupChannel/useChannelInfo'
import React, { ReactElement } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { ChannelType } from 'types'

import Avatar from './Avatar'
import ChannelCover from './ChannelCover'

const ChannelMembersPreview = React.memo(
  ({
    channelUrl,
    size,
    containerStyle,
  }: {
    channelUrl: string
    size: number
    containerStyle?: StyleProp<ViewStyle>
  }): ReactElement | null => {
    const { channel, channelImages } = useChannelInfo({ channelUrl })

    if (!channel) {
      return null
    }

    return (
      <Row
        style={[
          styles.container,
          containerStyle,
          { paddingStart: (-1 * size) / 2 },
        ]}
      >
        {channelImages && channelImages.length > 1 ? (
          channelImages.map((image: string, i: number) => (
            <View
              key={`displayUsers-${i}`}
              style={[
                styles.userImg,
                {
                  marginStart:
                    i === channelImages.length - 1 ? 0 : (-1 * size) / 2,
                },
              ]}
            >
              <Avatar size={size} uri={image} />
            </View>
          ))
        ) : (
          <View style={styles.userImg}>
            <ChannelCover channel={channel} size={size} />
          </View>
        )}

        {channel.customType !== ChannelType.DIRECT && (
          <View style={styles.userLengthBox}>
            <FormText fontType="R.12">{channel.memberCount}</FormText>
          </View>
        )}
      </Row>
    )
  }
)

export default ChannelMembersPreview

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    alignSelf: 'flex-start',
  },
  userImg: {
    backgroundColor: COLOR.white,
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLOR.black._50,
  },
  userLengthBox: {
    position: 'absolute',
    backgroundColor: COLOR.black._50,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 999,
    bottom: 0,
    left: 0,
  },
})
