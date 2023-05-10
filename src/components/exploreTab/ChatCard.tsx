import images from 'assets/images'
import { Card, FormImage, FormText, Row, Tag } from 'components'
import { COLOR, NETWORK, UTIL } from 'consts'
import _ from 'lodash'
import React, { ReactElement } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { FbChannel } from 'types'

const ChatCard = ({
  chat,
  onClick,
}: {
  chat: FbChannel
  onClick: (value: FbChannel) => void
}): ReactElement => {
  return (
    <Card borderRound={true}>
      <TouchableOpacity onPress={(): void => onClick(chat)}>
        <Row style={styles.channelBox}>
          <View style={styles.channelImg}>
            <FormImage
              source={
                chat.coverImage ? { uri: chat.coverImage } : images.palm_logo
              }
              size={56}
            />
          </View>
        </Row>
        <View style={styles.section}>
          <FormText fontType="SB.14">{chat.name}</FormText>
        </View>
        <View style={styles.section}>
          <Row style={{ flexWrap: 'wrap', gap: 4 }}>
            {_.map(chat.tags, (item, index) => (
              <Tag key={`chat.tags-${index}`} title={item} />
            ))}
          </Row>
        </View>
        {!!chat.gating?.amount && (
          <View style={styles.section}>
            <Row style={styles.gatingTokeBox}>
              <Icon color={COLOR.black._100} size={16} name="alert-circle" />
              {/* <FormImage source={chat.gating.img} size={40} /> */}

              <Row>
                <FormText color={COLOR.black._500} fontType="B.12">
                  {chat.gating.amount}
                </FormText>
                <FormText color={COLOR.black._500} fontType="R.12">
                  {' of'}
                </FormText>
                {chat.gating.gatingType === 'Native' ? (
                  <View>
                    <FormText fontType="B.12">
                      {' '}
                      {NETWORK.nativeToken[chat.gating.chain]}
                    </FormText>
                  </View>
                ) : (
                  <View>
                    <FormText fontType="B.12">
                      {UTIL.truncate(chat.gating.tokenAddress)}
                    </FormText>
                  </View>
                )}
                <FormText fontType="R.12"> required to join</FormText>
              </Row>
            </Row>
          </View>
        )}
      </TouchableOpacity>
    </Card>
  )
}

export default ChatCard

const styles = StyleSheet.create({
  channelBox: {},
  channelImg: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  userLengthBox: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    backgroundColor: COLOR.black._50,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 999,
  },
  section: {
    paddingTop: 16,
  },
  tagItem: {
    backgroundColor: COLOR.black._50,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  gatingTokeBox: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: COLOR.black._90010,
    columnGap: 8,
    alignItems: 'center',
  },
})
