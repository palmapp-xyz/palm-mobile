import React, { ReactElement, useEffect } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import { Container, FormImage, FormInput, Row } from 'components'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import images from 'assets/images'
import RecommendChat from './RecommendChat'
import RecommendUsers from './RecommendUsers'

const ExploreScreen = (): ReactElement => {
  const { navigation } = useAppNavigation()

  useEffect(() => {
    navigation.navigate(Routes.InitExplore)
  }, [])

  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <Container style={styles.container}>
        <Row style={styles.header}>
          <FormImage source={images.palm_logo} size={44} />
          <Row />
        </Row>
        <View style={styles.searchBox}>
          <FormInput />
        </View>

        <RecommendChat />
        <RecommendUsers />
      </Container>
    </ScrollView>
  )
}

export default ExploreScreen

const styles = StyleSheet.create({
  container: { flex: 1, marginBottom: -30 },
  header: {
    height: 72,
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchBox: {
    paddingTop: 12,
    paddingHorizontal: 20,
  },
})
