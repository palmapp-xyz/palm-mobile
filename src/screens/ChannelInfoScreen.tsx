import images from 'assets/images'
import {
  Container,
  FormImage,
  FormText,
  Header,
  MediaRenderer,
  Row,
  Tag,
} from 'components'
import LoadingPage from 'components/atoms/LoadingPage'
import { COLOR, NETWORK, UTIL } from 'consts'
import { format } from 'date-fns'
import useAuth from 'hooks/auth/useAuth'
import useChannelInfo from 'hooks/page/groupChannel/useChannelInfo'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import _ from 'lodash'
import React, { ReactElement } from 'react'
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { SbUserMetadata } from 'types'

import { useLocalization, useSendbirdChat } from '@sendbird/uikit-react-native'
import { useAlert } from '@sendbird/uikit-react-native-foundation'

const ChannelInfoScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.ChannelInfo>()
  const { alert } = useAlert()
  const { user } = useAuth()
  const { STRINGS } = useLocalization()
  const { sdk } = useSendbirdChat()
  const { channel, channelName, tags, desc, gatingToken, loading } =
    useChannelInfo({ channelUrl: params.channelUrl })

  const channelMembers =
    channel?.members.sort(a => (a.profileUrl ? -1 : 1)) || []
  const displayUsers = [...channelMembers]
    .sort(a => (a.profileUrl ? 1 : -1))
    .slice(-3)

  if (loading) {
    return <LoadingPage />
  } else if (!channel) {
    alert({
      message: 'Could not retrieve channel info data. Please try again later.',
      buttons: [
        {
          text: STRINGS.DIALOG.ALERT_DEFAULT_OK,
          onPress: () => navigation.goBack(),
        },
      ],
    })
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
        <ScrollView style={{ flex: 1 }} bounces={false}>
          <View
            style={{
              paddingTop: 92,
              backgroundColor: COLOR.black._90005,
            }}
          />
          <View style={{ paddingHorizontal: 20 }}>
            <Row style={styles.userBox}>
              {_.map(displayUsers, (item, j) => {
                return (
                  <View
                    key={`displayUsers-${j}`}
                    style={[
                      styles.userImg,
                      {
                        marginLeft: displayUsers.length > j + 1 ? -42 : 0,
                      },
                    ]}
                  >
                    <FormImage
                      source={
                        item.profileUrl
                          ? { uri: item.profileUrl }
                          : images.blank_profile
                      }
                      size={100}
                    />
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
              <FormText fontType="B.16">{channelName}</FormText>
            </View>
            <View style={styles.section}>
              <FormText fontType="R.12">
                {channel.memberCount} Members ∙{' '}
                {format(new Date(channel.createdAt), 'yy.MM.dd')} Created
              </FormText>
            </View>
            <View style={styles.section}>
              <FormText fontType="R.12">{desc}</FormText>
            </View>

            {gatingToken && Number(gatingToken.amount) > 0 && (
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
                        {gatingToken?.amount}
                      </FormText>
                      <FormText color={COLOR.black._500} fontType="R.12">
                        {' of '}
                      </FormText>
                      {gatingToken?.gatingType === 'Native' ? (
                        <View>
                          <FormText fontType="B.12">
                            {NETWORK.nativeToken[gatingToken.chain]}
                          </FormText>
                        </View>
                      ) : (
                        <View>
                          <FormText fontType="B.12">
                            {UTIL.truncate(gatingToken.tokenAddress)}
                          </FormText>
                        </View>
                      )}
                      <FormText fontType="R.12"> required to join</FormText>
                    </Row>
                  </View>
                </Row>
              </View>
            )}
            <View style={styles.section}>
              <Row style={{ flexWrap: 'wrap', gap: 8 }}>
                {_.map(tags, (tag, index) => {
                  return <Tag key={`inputTagList-${index}`} title={tag} />
                })}
              </Row>
            </View>
          </View>
          <View
            style={{
              borderTopColor: COLOR.black._100,
              borderTopWidth: 1,
              paddingBottom: 20,
            }}
          />
          <View style={[styles.section, { paddingHorizontal: 20 }]}>
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
                data={channelMembers}
                scrollEnabled={false}
                keyExtractor={(item, index): string => `attributes-${index}`}
                contentContainerStyle={{ gap: 10 }}
                renderItem={({ item }): ReactElement => {
                  const source = item.profileUrl
                    ? { uri: item.profileUrl }
                    : images.blank_profile

                  const targetAddress = (item.metaData as SbUserMetadata)
                    .address

                  const isMe = user?.address === targetAddress
                  return (
                    <Pressable
                      onPress={(): void => {
                        if (isMe) {
                          return
                        }

                        navigation.navigate(Routes.UserProfile, {
                          address: targetAddress,
                          profileId: item.userId,
                        })
                      }}
                    >
                      <Row style={{ alignItems: 'center', gap: 10 }}>
                        <MediaRenderer
                          src={source.uri}
                          width={40}
                          height={40}
                          style={{ borderRadius: 50 }}
                        />
                        <FormText>
                          {item.nickname} {isMe && '(me)'}
                        </FormText>
                      </Row>
                    </Pressable>
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
          {channel.myRole === 'operator' && (
            <TouchableOpacity
              onPress={(): void => {
                navigation.navigate(Routes.ChannelSetting, params)
              }}
            >
              <Ionicons name="settings-outline" size={24} />
            </TouchableOpacity>
          )}
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
