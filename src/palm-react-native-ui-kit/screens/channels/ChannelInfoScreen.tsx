import { format } from 'date-fns'
import _ from 'lodash'
import { COLOR, NETWORK } from 'palm-core/consts'
import { UTIL } from 'palm-core/libs'
import { Routes } from 'palm-core/libs/navigation'
import { ChannelType, SbUserMetadata } from 'palm-core/types'
import {
  Container,
  FormText,
  Header,
  Row,
  Tag,
} from 'palm-react-native-ui-kit/components'
import LoadingPage from 'palm-react-native-ui-kit/components/atoms/LoadingPage'
import Avatar from 'palm-react-native-ui-kit/components/sendbird/Avatar'
import ChannelMembersPreview from 'palm-react-native-ui-kit/components/sendbird/ChannelMembersPreview'
import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import useAuth from 'palm-react/hooks/auth/useAuth'
import useChannelInfo from 'palm-react/hooks/page/groupChannel/useChannelInfo'
import images from 'palm-ui-kit/assets/images'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { useIsFocused } from '@react-navigation/native'
import { PushTriggerOption } from '@sendbird/chat'
import { Member } from '@sendbird/chat/groupChannel'
import { useLocalization, useSendbirdChat } from '@sendbird/uikit-react-native'
import { useAlert } from '@sendbird/uikit-react-native-foundation'

const ChannelInfoScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.ChannelInfo>()
  const { alert } = useAlert()
  const { t } = useTranslation()
  const { user } = useAuth()
  const { STRINGS } = useLocalization()
  const { sdk } = useSendbirdChat()
  const { channel, channelName, tags, desc, gatingToken, loading } =
    useChannelInfo({ channelUrl: params.channelUrl })

  const [channelMembers, setChannelMembers] = useState<Member[]>([])

  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      channel?.refresh()
    }
  }, [isFocused])

  useEffect(() => {
    if (channel?.members) {
      const sortedMembers = channel.members.sort(a => (a.profileUrl ? -1 : 1))
      const moveToFirstMembers = UTIL.moveToFirstOfArray(
        sortedMembers,
        member => (member.metaData as SbUserMetadata).address === user?.address
      )
      setChannelMembers(moveToFirstMembers)
    }
  }, [channel?.members])

  const [isMute, setMute] = useState<boolean>()

  const toggleMute = async (): Promise<void> => {
    isMute
      ? await channel?.setMyPushTriggerOption(PushTriggerOption.DEFAULT)
      : await channel?.setMyPushTriggerOption(PushTriggerOption.OFF)
    setMute(!isMute)
  }

  useEffect(() => {
    if (channel?.myPushTriggerOption) {
      setMute(channel?.myPushTriggerOption === PushTriggerOption.OFF)
    }
  }, [channel?.myPushTriggerOption])

  if (loading) {
    return <LoadingPage />
  } else if (!channel) {
    alert({
      message: t('Channels.ChannelInfoNotRetrieveAlertMessage'),
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
            <ChannelMembersPreview
              channelUrl={channel.url}
              size={100}
              containerStyle={{ marginTop: -88, marginBottom: 22 }}
            />
            <View style={{ paddingBottom: 8 }}>
              <FormText font={'B'} size={18}>
                {channelName}
              </FormText>
            </View>
            <View style={styles.section}>
              <FormText color={COLOR.black._400}>
                {t('Channels.ChannelInfoMemberAndDate', {
                  memberCount: channel.memberCount,
                  createAt: format(new Date(channel.createdAt), 'yy.MM.dd'),
                })}
              </FormText>
            </View>
            <View style={styles.section}>
              <FormText color={COLOR.black._300}>{desc}</FormText>
            </View>

            {gatingToken && Number(gatingToken.amount) > 0 && (
              <View style={styles.section}>
                <FormText font="SB" style={{ marginBottom: 8 }}>
                  Token Gating
                </FormText>
                <Row style={styles.gatingTokeBox}>
                  <Ionicons
                    color={COLOR.black._100}
                    size={16}
                    name="alert-circle"
                  />
                  {/* <FormImage source={fsChannelField.gating.img} size={40} /> */}
                  <View>
                    <Row>
                      <FormText color={COLOR.black._500} font={'B'}>
                        {t('Channels.ChannelInfoGatingTokenAmount', {
                          amount: gatingToken?.amount,
                        })}
                      </FormText>
                      <FormText color={COLOR.black._500}>
                        {t('Channels.ChannelInfoGatingTokenOf')}
                      </FormText>
                      <View>
                        <FormText font={'B'}>
                          {t('Channels.ChannelInfoGatingTokenChainOrAddr', {
                            chainOrAddress:
                              gatingToken?.gatingType === 'Native'
                                ? NETWORK.nativeToken[gatingToken.chain]
                                : UTIL.truncate(gatingToken.tokenAddress),
                          })}
                        </FormText>
                      </View>
                      <FormText>
                        {t('Channels.ChannelInfoGatingTokenRequiredToJoin')}
                      </FormText>
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
              <FormText font={'SB'} color={COLOR.black._900}>
                {t('Channels.ChannelInfoMembers')}
              </FormText>
              {channel.customType !== ChannelType.DIRECT && (
                <TouchableOpacity
                  onPress={(): void => {
                    navigation.navigate(Routes.GroupChannelInvite, params)
                  }}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                >
                  <Ionicons
                    name="add-outline"
                    size={16}
                    color={COLOR.black._900}
                  />
                  <FormText color={COLOR.black._500}>
                    {t('Channels.ChannelInfoInvite')}
                  </FormText>
                </TouchableOpacity>
              )}
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

                        navigation.push(Routes.UserProfile, {
                          address: targetAddress,
                          profileId: item.userId,
                          channel: channel,
                        })
                      }}
                    >
                      <Row style={{ alignItems: 'center', gap: 10 }}>
                        <Avatar uri={source.uri} size={40} />
                        <FormText>
                          {t('Channels.ChannelInfoNickname', {
                            nickname: item.nickname,
                            me: isMe
                              ? t('Channels.ChannelInfoNicknameIsMe')
                              : '',
                          })}
                        </FormText>
                        {channel.customType !== ChannelType.DIRECT &&
                          item.role === 'operator' && (
                            <Image
                              source={images.crown}
                              style={{ width: 16, height: 16 }}
                            />
                          )}
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
              channel.leave(channel.myRole === 'operator').then(() => {
                navigation.navigate(Routes.GroupChannelList)
                sdk.clearCachedMessages([channel.url]).catch()
              })
            }}
          >
            <Ionicons name="exit-outline" size={24} color={COLOR.error} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={toggleMute}>
              {isMute ? (
                <Ionicons
                  name={'notifications-off-outline'}
                  size={24}
                  color={COLOR.black._500}
                />
              ) : (
                <Ionicons
                  name={'notifications-outline'}
                  size={24}
                  color={COLOR.black._900}
                />
              )}
            </TouchableOpacity>
            {channel.customType !== ChannelType.DIRECT &&
              channel.myRole === 'operator' && (
                <TouchableOpacity
                  onPress={(): void => {
                    navigation.navigate(Routes.ChannelSetting, params)
                  }}
                  style={{ marginStart: 20 }}
                >
                  <Ionicons
                    name="settings-outline"
                    size={24}
                    color={COLOR.black._500}
                  />
                </TouchableOpacity>
              )}
          </View>
        </Row>
      </View>
    </Container>
  )
}

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
    borderWidth: 0,
    borderRadius: 12,
    backgroundColor: COLOR.black._90005,
    columnGap: 8,
    alignItems: 'center',
  },
})

export default ChannelInfoScreen
