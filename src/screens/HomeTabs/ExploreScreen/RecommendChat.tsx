import { FormText } from 'components'
import ChatCard from 'components/exploreTab/ChatCard'
import { COLOR } from 'consts'
import useExploreRecommendChat from 'hooks/page/explore/useExploreRecommendChat'
import { UseExploreSearchReturn } from 'hooks/page/explore/useExploreSearch'
import _ from 'lodash'
import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'

const RecommendChat = ({
  useExploreSearchReturn,
}: {
  useExploreSearchReturn: UseExploreSearchReturn
}): ReactElement => {
  const { setSelectedChannel } = useExploreSearchReturn

  const { fsChannelList } = useExploreRecommendChat()

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.title}>
          <FormText fontType="B.24">{'Explore channels\nto join'}</FormText>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.optionResultList}>
          {_.map(fsChannelList, (chat, index) => (
            <ChatCard
              key={`fsChannelList-${index}`}
              chat={chat}
              onClick={setSelectedChannel}
            />
          ))}
        </View>
      </View>
    </View>
  )
}

export default RecommendChat

const styles = StyleSheet.create({
  container: { paddingTop: 20 },
  header: { paddingHorizontal: 20, paddingBottom: 20 },
  title: {
    paddingBottom: 20,
  },
  optionItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLOR.black._50,
  },
  body: {
    backgroundColor: COLOR.black._90005,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  optionResultList: {
    rowGap: 12,
  },
})
