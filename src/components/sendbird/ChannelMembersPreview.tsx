import images from 'assets/images'
import { FormImage, FormText, MediaRenderer, Row } from 'components'
import { COLOR } from 'consts'
import useChannelInfo from 'hooks/page/groupChannel/useChannelInfo'
import _ from 'lodash'
import React, { ReactElement } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { ChannelType } from 'types'

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

    // console.log('!!!!!', channelImages?.reverse())

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
              <MediaRenderer src={image} width={size} height={size} />
            </View>
          ))
        ) : (
          <View style={styles.userImg}>
            <FormImage
              source={
                channelImages && _.head(channelImages)
                  ? { uri: _.head(channelImages) }
                  : images.palm_logo
              }
              size={size}
            />
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
