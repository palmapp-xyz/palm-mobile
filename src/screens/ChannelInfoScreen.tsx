import { Container, FormImage, FormText, Header, Row, Tag } from 'components'
import { COLOR, NETWORK, UTIL } from 'consts'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import React, { ReactElement } from 'react'
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import { useSendbirdChat } from '@sendbird/uikit-react-native'
import images from 'assets/images'
import { format } from 'date-fns'
import useFsChannel from 'hooks/firestore/useFsChannel'
import _ from 'lodash'
import Ionicons from 'react-native-vector-icons/Ionicons'

const ChannelInfoScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.ChannelInfo>()
  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, params.channelUrl)
  const { fsChannelField } = useFsChannel({ channelUrl: params.channelUrl })
  const displayUsers = channel?.members.slice(0, 3) || []

  if (!channel || !fsChannelField) {
    return <></>
  }

  return (
    <Container
      style={styles.container}
      safeAreaBackgroundColor={COLOR.black._90005}
    >
      <Header
        left="back"
        onPressLeft={navigation.goBack}
        containerStyle={{ backgroundColor: COLOR.black._90005 }}
      />
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
          <View
            style={{
              paddingTop: 92,
              backgroundColor: COLOR.black._90005,
              marginHorizontal: -20,
            }}
          />
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
                    ]}
                  >
                    <FormImage source={{ uri: user.profileUrl }} size={100} />
                  </View>
                )
              })}

              {channel.memberCount > 3 && (
                <View style={styles.userLengthBox}>
                  <FormText fontType="R.12">{channel.memberCount}</FormText>
                </View>
              )}
            </Row>
            <View style={{ paddingBottom: 8 }}>
              <FormText fontType="B.16">{fsChannelField.name}</FormText>
            </View>
            <View style={styles.section}>
              <FormText fontType="R.12">
                {channel.memberCount} Members ∙{' '}
                {format(new Date(channel.createdAt), 'yy.MM.dd')} Created
              </FormText>
            </View>
            <View style={styles.section}>
              <FormText fontType="R.12">{fsChannelField.desc}</FormText>
            </View>

            {!!fsChannelField.gating?.amount && (
              <View style={styles.section}>
                <Row style={styles.gatingTokeBox}>
                  <Ionicons
                    color={COLOR.black._100}
                    size={16}
                    name="alert-circle"
                  />
                  {/* <FormImage source={fsChannelField.gating.img} size={40} /> */}
                  <View>
                    <Row>
                      <FormText color={COLOR.black._500} fontType="B.12">
                        {fsChannelField.gating.amount}
                      </FormText>
                      <FormText color={COLOR.black._500} fontType="R.12">
                        of
                      </FormText>
                    </Row>
                    <Row>
                      {fsChannelField.gating.gatingType === 'Native' ? (
                        <View>
                          <FormText fontType="B.12">
                            {NETWORK.nativeToken[fsChannelField.gating.chain]}
                          </FormText>
                        </View>
                      ) : (
                        <View>
                          <FormText fontType="B.12">
                            {UTIL.truncate(fsChannelField.gating.tokenAddress)}
                          </FormText>
                        </View>
                      )}
                      <FormText fontType="R.12"> are required</FormText>
                    </Row>
                  </View>
                </Row>
              </View>
            )}
            <View style={styles.section}>
              <Row style={{ flexWrap: 'wrap', gap: 8 }}>
                {_.map(fsChannelField.tags, (tag, index) => {
                  return <Tag key={`inputTagList-${index}`} title={tag} />
                })}
              </Row>
            </View>
          </View>
          <View
            style={{
              borderTopColor: COLOR.black._100,
              borderTopWidth: 1,
              marginHorizontal: -20,
              paddingBottom: 20,
            }}
          />
          <View style={styles.section}>
            <Row
              style={{ alignItems: 'center', justifyContent: 'space-between' }}
            >
              <FormText fontType="SB.14">Members</FormText>
              <TouchableOpacity
                onPress={(): void => {
                  navigation.navigate(Routes.GroupChannelMembers, params)
                }}
              >
                <FormText fontType="R.12">+ Invite member</FormText>
              </TouchableOpacity>
            </Row>
            <View style={{ paddingTop: 16 }}>
              <FlatList
                data={channel.members}
                scrollEnabled={false}
                keyExtractor={(item, index): string => `attributes-${index}`}
                contentContainerStyle={{ gap: 10 }}
                renderItem={({ item }): ReactElement => {
                  const source = item.profileUrl
                    ? { uri: item.profileUrl }
                    : images.blank_profile

                  return (
                    <Row style={{ alignItems: 'center', gap: 10 }}>
                      <View
                        style={{
                          borderRadius: 999,
                          overflow: 'hidden',
                          alignSelf: 'flex-start',
                        }}
                      >
                        <FormImage source={source} size={40} />
                      </View>
                      <FormText>{item.nickname}</FormText>
                    </Row>
                  )
                }}
              />
            </View>
          </View>
        </ScrollView>
        <Row style={styles.footer}>
          <TouchableOpacity
            onPress={(): void => {
              channel.leave().then(() => {
                navigation.navigate(Routes.GroupChannelList)
                sdk.clearCachedMessages([channel.url]).catch()
              })
            }}
          >
            <Ionicons name="exit-outline" size={24} color={COLOR.error} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={(): void => {
              navigation.navigate(Routes.ChannelSetting, params)
            }}
          >
            <Ionicons name="settings-outline" size={24} />
          </TouchableOpacity>
        </Row>
      </View>
    </Container>
  )
}

export default ChannelInfoScreen

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLOR.black._10 },
  section: {
    paddingBottom: 20,
  },
  sectionTitle: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  menuItemRow: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLOR.black._90010,
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  gatingTokeBox: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: COLOR.black._90010,
    columnGap: 8,
    alignItems: 'center',
  },
  userBox: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    alignSelf: 'flex-start',
    marginTop: -88,
    paddingBottom: 22,
  },
  userImg: {
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
})
