import React, { ReactElement } from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'

import { FormText, Row } from 'components'
import { COLOR } from 'consts'
import { UseExploreSearchReturn } from 'hooks/page/explore/useExploreSearch'
import _ from 'lodash'
import Ionicons from 'react-native-vector-icons/Ionicons'

const RecentlySearched = ({
  inputRef,
  useExploreSearchReturn,
}: {
  inputRef: React.RefObject<TextInput>
  useExploreSearchReturn: UseExploreSearchReturn
}): ReactElement => {
  const {
    setInputSearch,
    onClickConfirm,
    recentlySearchedList,
    deleteRecentlySearch,
  } = useExploreSearchReturn

  return (
    <View style={styles.container}>
      {_.map(recentlySearchedList, (item, index) => {
        return (
          <Row key={`recentlySearchedList-${index}`} style={styles.searchItem}>
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 16,
              }}
              onPress={async (): Promise<void> => {
                console.log('id : ', item.id)
                setInputSearch(item.search)
                inputRef.current?.blur()
                onClickConfirm(item.search)
              }}
            >
              <FormText
                fontType="R.14"
                color={COLOR.black._400}
                numberOfLines={1}
                style={{ flex: 1 }}
              >
                {item.search}
              </FormText>
              <FormText fontType="R.14" color={COLOR.black._200}>
                {item.date}
              </FormText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={(): void => {
                deleteRecentlySearch(item.id)
              }}
            >
              <Ionicons
                name="close-outline"
                size={16}
                color={COLOR.black._400}
              />
            </TouchableOpacity>
          </Row>
        )
      })}
    </View>
  )
}

export default RecentlySearched

const styles = StyleSheet.create({
  container: {},
  searchItem: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
})
