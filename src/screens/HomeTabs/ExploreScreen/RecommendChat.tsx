import React, { ReactElement, useState } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import _ from 'lodash'
import Icon from 'react-native-vector-icons/Ionicons'

import { COLOR } from 'consts'
import { FormText, Row, MenuItem } from 'components'
import useExploreRecommendChat from 'hooks/page/explore/useExploreRecommendChat'
import RecommendChatCard from 'components/exploreTab/RecommendChatCard'

const RecommendChat = (): ReactElement => {
  const [selectedOption, setSelectedOption] = useState('')

  const optionList = [
    { id: '1', title: 'gogoKlay' },
    { id: '2', title: 'stop falling' },
    { id: '3', title: 'sample1' },
    { id: '4', title: 'sample2' },
  ]

  const { chatList } = useExploreRecommendChat()

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.title}>
          <FormText fontType="B.24">
            {'How about to join\na chat room?'}
          </FormText>
        </View>
        <FlatList
          data={optionList}
          keyExtractor={(_item, index): string => `optionList-${index}`}
          horizontal
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }): ReactElement => (
            <MenuItem
              value={item.id}
              title={item.title}
              selected={selectedOption === item.id}
              setSelected={setSelectedOption}
            />
          )}
        />
      </View>
      <View style={styles.body}>
        <TouchableOpacity>
          <Row
            style={{
              justifyContent: 'flex-end',
              alignItems: 'center',
              paddingBottom: 12,
              columnGap: 4,
            }}>
            <Icon name="refresh" />
            <FormText fontType="R.12" color={COLOR.black._500}>
              Refresh List
            </FormText>
          </Row>
        </TouchableOpacity>
        <View style={styles.optionResultList}>
          {_.map(chatList, (chat, index) => (
            <RecommendChatCard key={`chatList-${index}`} chat={chat} />
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
    backgroundColor: `${COLOR.black._900}${COLOR.opacity._05}`,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  optionResultList: {
    rowGap: 12,
  },
})
