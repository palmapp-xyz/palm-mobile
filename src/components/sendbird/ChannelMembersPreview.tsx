import { FormText, Row } from 'components'
import useChannelInfo from 'hooks/page/groupChannel/useChannelInfo'
import _ from 'lodash'
import { COLOR } from 'palm-core/consts'
import { ChannelType } from 'palm-core/types'
import React, { ReactElement } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import Avatar from './Avatar'

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
      <Row style={[styles.container, containerStyle]}>
        {channelImages && channelImages.length > 1 ? (
          channelImages.map((image: string, i: number) =>
            i < 3 ? (
              <View
                key={`displayUsers-${i}`}
                style={[
                  styles.userImg,
                  {
                    marginStart:
                      i === channelImages.length - 1
                        ? 0
                        : channelImages.length === 2
                        ? (-1 * size) / 1.75
                        : (-1 * size) / 1.25,
                  },
                ]}
              >
                <Avatar size={size} uri={image} />
              </View>
            ) : null
          )
        ) : (
          <View style={styles.userImg}>
            <Avatar uri={_.first(channelImages)} size={size} />
          </View>
        )}

        {channel.customType !== ChannelType.DIRECT &&
          channel.memberCount > 3 && (
            <View style={styles.userLengthBox}>
              <FormText>
                {channel.memberCount > 99 ? '99+' : channel.memberCount}
              </FormText>
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
