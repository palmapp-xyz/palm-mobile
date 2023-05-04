import images from 'assets/images'
import { Card, FormImage, FormText, Row, Tag } from 'components'
import { COLOR, NETWORK, UTIL } from 'consts'
import React, { ReactElement } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
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
    <Card style={{ paddingRight: 0 }}>
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
          <FlatList
            data={chat.tags}
            keyExtractor={(_item, index): string => `tagList-${index}`}
            horizontal
            contentContainerStyle={{ gap: 4 }}
            renderItem={({ item }): ReactElement => <Tag title={item} />}
          />
        </View>
        {!!chat.gating?.amount && (
          <View style={styles.section}>
            <Row style={styles.gatingTokeBox}>
              <Icon color={COLOR.black._100} size={16} name="alert-circle" />
              {/* <FormImage source={chat.gating.img} size={40} /> */}
              <View>
                <Row>
                  <FormText color={COLOR.black._500} fontType="B.12">
                    {chat.gating.amount}
                  </FormText>
                  <FormText color={COLOR.black._500} fontType="R.12">
                    of
                  </FormText>
                </Row>
                <Row>
                  {chat.gating.gatingType === 'Native' ? (
                    <View>
                      <FormText fontType="B.12">
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
                  <FormText fontType="R.12"> are required</FormText>
                </Row>
              </View>
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
