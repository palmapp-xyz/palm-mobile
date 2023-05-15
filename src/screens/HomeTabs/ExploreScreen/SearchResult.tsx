import React, { Fragment, ReactElement, useCallback, useState } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import { FormText, Row } from 'components'
import ChatCard from 'components/exploreTab/ChatCard'
import UserCard from 'components/exploreTab/UserCard'
import { COLOR } from 'consts'
import { UseExploreSearchReturn } from 'hooks/page/explore/useExploreSearch'
import _ from 'lodash'

type TabType = 'chat' | 'user'

const SearchResult = ({
  useExploreSearchReturn,
}: {
  useExploreSearchReturn: UseExploreSearchReturn
}): ReactElement => {
  const {
    isSearching,
    searchChannelResult,
    searchProfileResult,
    setSelectedChannel,
  } = useExploreSearchReturn

  const [selectedMenu, setSelectedMenu] = useState<TabType>('chat')

  const TabItem = useCallback(
    ({ title, target }: { title: string; target: TabType }): ReactElement => {
      const selected = target === selectedMenu

      return (
        <TouchableOpacity
          style={[
            styles.tabItem,
            {
              borderBottomColor: selected ? COLOR.primary._400 : 'transparent',
            },
          ]}
          onPress={(): void => {
            setSelectedMenu(target)
          }}
        >
          <FormText>{title}</FormText>
        </TouchableOpacity>
      )
    },
    [selectedMenu]
  )

  if (isSearching) {
    return <ActivityIndicator />
  }

  return (
    <>
      <View style={styles.container}>
        <Row>
          <TabItem title="Chat Room" target={'chat'} />
          <TabItem title="User" target={'user'} />
        </Row>
        <ScrollView
          style={styles.body}
          contentContainerStyle={{ rowGap: 12, paddingBottom: 60 }}
        >
          {selectedMenu === 'chat'
            ? _.map(searchChannelResult, (item, index) => {
                return (
                  <Fragment key={`searchChannelResult-${index}`}>
                    <ChatCard chat={item} onClick={setSelectedChannel} />
                  </Fragment>
                )
              })
            : _.map(searchProfileResult, (item, index) => {
                return (
                  <Fragment key={`searchProfileResult-${index}`}>
                    <UserCard user={item} />
                  </Fragment>
                )
              })}
        </ScrollView>
      </View>
    </>
  )
}

export default SearchResult

const styles = StyleSheet.create({
  container: {},
  tabItem: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 4,
  },
  body: {
    backgroundColor: COLOR.black._90005,
    paddingVertical: 16,
    paddingHorizontal: 20,
    height: '100%',
    marginBottom: -100,
  },
})
