import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'
import { FlatList } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'

import { Card, FormImage, FormText, Row } from 'components'
import { COLOR } from 'consts'
import { ChatItem } from 'hooks/page/explore/useExploreRecommendChat'

const RecommendChatCard = ({ chat }: { chat: ChatItem }): ReactElement => {
  const displayUsers = chat.users.slice(0, 3)
  return (
    <Card>
      <View>
        <Row style={styles.userBox}>
          {_.map(displayUsers, (user, j) => {
            return (
              <View
                key={`users-${j}`}
                style={[
                  styles.userImg,
                  {
                    marginLeft: displayUsers.length > j + 1 ? -42 : 0,
                  },
                ]}>
                <FormImage source={user.img} size={56} />
              </View>
            )
          })}

          {chat.users.length > 3 && (
            <View style={styles.userLengthBox}>
              <FormText fontType="R.12">{chat.users.length}</FormText>
            </View>
          )}
        </Row>
        <View style={styles.section}>
          <FormText fontType="SB.14">{chat.title}</FormText>
          <FormText fontType="R.10">32mins ago</FormText>
        </View>
        <View style={styles.section}>
          <FlatList
            data={chat.tagList}
            keyExtractor={(_item, index): string => `tagList-${index}`}
            horizontal
            contentContainerStyle={{ gap: 4 }}
            renderItem={({ item: tag }): ReactElement => {
              return (
                <View style={styles.tagItem}>
                  <FormText fontType="SB.14" color={COLOR.gray._500}>
                    #{tag}
                  </FormText>
                </View>
              )
            }}
          />
        </View>
        {!!chat.gatingToken && (
          <View style={styles.section}>
            <Row style={styles.gatingTokeBox}>
              <Icon color={COLOR.gray._100} size={16} name="alert-circle" />
              <FormImage source={chat.gatingToken.img} size={40} />
              <View>
                <Row>
                  <FormText color={COLOR.gray._500} fontType="B.12">
                    {chat.gatingToken.amount}
                  </FormText>
                  <FormText color={COLOR.gray._500} fontType="R.12">
                    of
                  </FormText>
                </Row>
                <Row>
                  <FormText fontType="B.12">
                    {chat.gatingToken.tokenName}
                  </FormText>
                  <FormText fontType="R.12"> are required</FormText>
                </Row>
              </View>
            </Row>
          </View>
        )}
      </View>
    </Card>
  )
}

export default RecommendChatCard

const styles = StyleSheet.create({
  userBox: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    alignSelf: 'flex-start',
  },
  userImg: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  userLengthBox: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    backgroundColor: COLOR.gray._50,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 999,
  },
  section: {
    paddingTop: 16,
  },
  tagItem: {
    backgroundColor: COLOR.gray._50,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  gatingTokeBox: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: `${COLOR.gray._900}${COLOR.opacity._10}`,
    columnGap: 8,
    alignItems: 'center',
  },
})