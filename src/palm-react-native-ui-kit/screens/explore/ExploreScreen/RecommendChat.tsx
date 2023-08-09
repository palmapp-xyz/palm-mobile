import { Routes } from 'palm-core/libs/navigation'
import { FbChannel } from 'palm-core/types'
import { FormText, SkeletonView } from 'palm-react-native-ui-kit/components'
import { useAppNavigation } from 'palm-react-native/app/useAppNavigation'
import useExploreRecommendChat from 'palm-react/hooks/page/explore/useExploreRecommendChat'
import { UseExploreSearchReturn } from 'palm-react/hooks/page/explore/useExploreSearch'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { MemberState } from '@sendbird/chat/groupChannel'
import { useSendbirdChat } from '@sendbird/uikit-react-native'
import _ from 'lodash'
import { COLOR } from 'palm-core/consts'
import ChatCard from 'palm-react-native-ui-kit/components/exploreTab/ChatCard'

const RecommendChat = ({
  useExploreSearchReturn,
}: {
  useExploreSearchReturn: UseExploreSearchReturn
}): ReactElement => {
  const { setSelectedChannel } = useExploreSearchReturn

  const { fsChannelList } = useExploreRecommendChat()
  const { t } = useTranslation()
  const { sdk } = useSendbirdChat()
  const { navigation } = useAppNavigation<Routes.Explore>()

  const onChatCardClick = async (chat: FbChannel): Promise<void> => {
    const channelUrl: string = chat.url
    if (channelUrl) {
      try {
        const channel = await sdk.groupChannel.getChannel(channelUrl)
        if (channel.myMemberState === MemberState.JOINED) {
          navigation.navigate(Routes.GroupChannel, {
            channelUrl,
          })
        } else {
          setSelectedChannel(chat)
        }
      } catch {}
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.title}>
          <FormText font={'B'} size={24}>
            {t('Explore.ExploreChannelsToJoin')}
          </FormText>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.optionResultList}>
          {_.times(5, index => {
            const available = index < fsChannelList.length
            return available ? (
              <ChatCard
                key={`fsChannelList-${index}`}
                chat={fsChannelList[index]}
                onClick={onChatCardClick}
              />
            ) : (
              <SkeletonView height={170} borderRadius={20} />
            )
          })}
        </View>
      </View>
    </View>
  )
}

export default RecommendChat

const styles = StyleSheet.create({
  container: {},
  header: {
    paddingVertical: 20,
    backgroundColor: COLOR.white,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {},
  optionItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLOR.black._50,
  },
  body: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  optionResultList: {
    rowGap: 12,
  },
})
