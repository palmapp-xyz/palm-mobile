import _ from 'lodash'
import { COLOR, NETWORK } from 'palm-core/consts'
import { Routes } from 'palm-core/libs/navigation'
import { FbChannel } from 'palm-core/types'
import {
  FormBottomSheet,
  FormButton,
  FormText,
  Row,
  Tag,
} from 'palm-react-native-ui-kit/components'
import ChannelMembersPreview from 'palm-react-native-ui-kit/components/sendbird/ChannelMembersPreview'
import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import { UseExploreSearchReturn } from 'palm-react/hooks/page/explore/useExploreSearch'
import React, { ReactElement, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import { useSendbirdChat } from '@sendbird/uikit-react-native'
import useFsChannel from 'palm-react/hooks/firestore/useFsChannel'

const SelectedChannel = ({
  selectedChannel,
  useExploreSearchReturn,
}: {
  selectedChannel: FbChannel
  useExploreSearchReturn: UseExploreSearchReturn
}): ReactElement => {
  const { navigation } = useAppNavigation()
  const snapPoints = useMemo(() => ['80%'], [])

  const { setSelectedChannel } = useExploreSearchReturn

  const { sdk } = useSendbirdChat()
  const { channel } = useGroupChannel(sdk, selectedChannel.url)
  const { fsChannelField } = useFsChannel({ channelUrl: selectedChannel.url })
  const { t } = useTranslation()

  const joinChannel = async (): Promise<void> => {
    if (channel) {
      if (channel.myMemberState === 'none') {
        await channel.join()
      }
      navigation.navigate(Routes.GroupChannel, {
        channelUrl: channel.url,
      })
    }
  }

  return (
    <FormBottomSheet
      showBottomSheet={!!selectedChannel}
      snapPoints={snapPoints}
      onClose={(): void => setSelectedChannel(undefined)}
      backgroundStyle={{
        backgroundColor: COLOR.black._10,
      }}
    >
      <View style={{ flex: 1, marginBottom: Platform.select({ android: 30 }) }}>
        <View style={styles.header} />
        <View style={styles.body}>
          <View style={styles.channelImg}>
            <ChannelMembersPreview
              channelUrl={selectedChannel.url}
              size={100}
            />
          </View>
          <View style={styles.section}>
            <FormText font={'B'} size={16}>
              {selectedChannel.name}
            </FormText>
          </View>
          <View style={styles.section}>
            <FormText color={COLOR.black._200}>{fsChannelField?.desc}</FormText>
          </View>
          {fsChannelField &&
            fsChannelField?.gating &&
            fsChannelField?.gating?.amount && (
              <View style={styles.section}>
                <Row style={styles.gatingTokeBox}>
                  <Icon
                    color={COLOR.black._100}
                    size={16}
                    name="alert-circle"
                  />
                  <View>
                    <Row>
                      <FormText color={COLOR.black._500} font={'B'}>
                        {fsChannelField.gating.amount}
                      </FormText>
                      <FormText color={COLOR.black._500}>{' of '}</FormText>
                      {fsChannelField.gating.gatingType === 'Native' ? (
                        <View>
                          <FormText font={'B'}>
                            {NETWORK.nativeToken[fsChannelField?.gating.chain]}
                          </FormText>
                        </View>
                      ) : (
                        <View>
                          <FormText font={'B'}>
                            {fsChannelField.gating.name}
                          </FormText>
                        </View>
                      )}
                      <FormText>
                        {t('Explore.ExploreSelectedChannelRequiredToJoin')}
                      </FormText>
                    </Row>
                  </View>
                </Row>
              </View>
            )}
          <View style={styles.section}>
            <Row style={{ flexWrap: 'wrap', gap: 4 }}>
              {_.map(selectedChannel.tags, (item, index) => (
                <Tag key={`selectedChannel.tags-${index}`} title={item} />
              ))}
            </Row>
          </View>
          <View style={{ flex: 1 }} />
          <View style={styles.footer}>
            <FormButton onPress={joinChannel}>{t('Common.Join')}</FormButton>
          </View>
        </View>
      </View>
    </FormBottomSheet>
  )
}

export default SelectedChannel

const styles = StyleSheet.create({
  header: {
    height: 160,
  },
  channelImg: {
    marginTop: -100,
    alignSelf: 'flex-start',
  },
  body: { flex: 1, paddingHorizontal: 20, backgroundColor: 'white', gap: 20 },
  section: {},
  gatingTokeBox: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: COLOR.black._90010,
    columnGap: 8,
    alignItems: 'center',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLOR.black._90010,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
})
