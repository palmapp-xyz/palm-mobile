import { FormText } from 'components'
import UserCard from 'components/exploreTab/UserCard'
import { COLOR } from 'consts'
import useExploreRecommendUsers from 'hooks/page/explore/useExploreRecommendUsers'
import _ from 'lodash'
import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'

const RecommendUsers = (): ReactElement => {
  // const [selectedOption, setSelectedOption] = useState('')

  // const optionList = [
  //   { id: '1', img: require('assets/temp/thumbs1.png') },
  //   { id: '2', img: require('assets/temp/thumbs2.png') },
  //   { id: '3', img: require('assets/temp/thumbs3.png') },
  //   { id: '4', img: require('assets/temp/thumbs4.png') },
  //   { id: '5', img: require('assets/temp/thumbs5.png') },
  //   { id: '6', img: require('assets/temp/thumbs6.png') },
  //   { id: '7', img: require('assets/temp/thumbs7.png') },
  // ]

  const { fsProfileList } = useExploreRecommendUsers()

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.title}>
          <FormText fontType="B.24">
            {'What about users\nwith similar tastes?'}
          </FormText>
        </View>
        {/* <FlatList
          data={optionList}
          keyExtractor={(_item, index): string => `optionList-${index}`}
          horizontal
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }): ReactElement => {
            const selected = selectedOption === item.id

            return (
              <TouchableOpacity
                style={[
                  styles.optionItem,
                  { backgroundColor: selected ? COLOR.main_light : 'white' },
                ]}
                onPress={(): void => {
                  setSelectedOption(item.id)
                }}
              >
                <FormImage source={item.img} size={40} />
              </TouchableOpacity>
            )
          }}
        /> */}
      </View>
      <View style={styles.body}>
        {/* <TouchableOpacity>
          <Row
            style={{
              justifyContent: 'flex-end',
              alignItems: 'center',
              paddingBottom: 12,
              columnGap: 4,
            }}
          >
            <Icon name="refresh" />
            <FormText fontType="R.12" color={COLOR.black._500}>
              Refresh List
            </FormText>
          </Row>
        </TouchableOpacity> */}
        <View style={styles.optionResultList}>
          {_.map(fsProfileList, (user, index) => (
            <UserCard key={`userList-${index}`} user={user} />
          ))}
        </View>
      </View>
    </View>
  )
}

export default RecommendUsers

const styles = StyleSheet.create({
  container: { paddingTop: 32 },
  header: { paddingHorizontal: 20, paddingBottom: 20 },
  title: {
    paddingBottom: 20,
  },
  optionItem: { borderRadius: 8, overflow: 'hidden' },
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
