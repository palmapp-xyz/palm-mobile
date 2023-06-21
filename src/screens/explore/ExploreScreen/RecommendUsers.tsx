import { FormText } from 'components'
import UserCard from 'components/exploreTab/UserCard'
import useExploreRecommendUsers from 'hooks/page/explore/useExploreRecommendUsers'
import _ from 'lodash'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

const RecommendUsers = (): ReactElement => {
  const { fsProfileList } = useExploreRecommendUsers()
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.title}>
          <FormText font={'B'} size={24}>
            {t('Explore.ExploreChatWithOthersDirectly')}
          </FormText>
        </View>
      </View>
      <View style={styles.body}>
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
  container: { paddingTop: 16 },
  header: { paddingHorizontal: 20 },
  title: {},
  optionItem: { borderRadius: 8, overflow: 'hidden' },
  body: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  optionResultList: {
    rowGap: 12,
  },
})
