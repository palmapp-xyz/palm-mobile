import React, { ReactElement, useEffect, useRef } from 'react'
import { Animated, ScrollView, StyleSheet, View } from 'react-native'

import { Container, FormImage, FormInput, Row } from 'components'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import images from 'assets/images'
import RecommendChat from './RecommendChat'
import RecommendUsers from './RecommendUsers'

const HEADER_HEIGHT = 72

const ExploreScreen = (): ReactElement => {
  const { navigation } = useAppNavigation()

  const scrollOffsetY = useRef(new Animated.Value(0)).current

  useEffect(() => {
    navigation.navigate(Routes.InitExplore)
  }, [])

  return (
    <Container style={styles.container}>
      <Animated.View
        style={[
          styles.headAnimationBox,
          {
            transform: [
              {
                translateY: scrollOffsetY.interpolate({
                  inputRange: [0, HEADER_HEIGHT],
                  outputRange: [0, -HEADER_HEIGHT],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}>
        <Animated.View
          style={{
            opacity: scrollOffsetY.interpolate({
              inputRange: [0, HEADER_HEIGHT],
              outputRange: [1, 0],
              extrapolate: 'clamp',
            }),
          }}>
          <Row style={styles.header}>
            <FormImage source={images.palm_logo} size={44} />
          </Row>
        </Animated.View>
        <View style={styles.searchBox}>
          <FormInput placeholder="Search by username, tag, chat room name..." />
        </View>
      </Animated.View>

      <ScrollView
        style={{ backgroundColor: 'white', paddingTop: HEADER_HEIGHT + 60 }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
          { useNativeDriver: false }
        )}>
        <RecommendChat />
        <RecommendUsers />
      </ScrollView>
    </Container>
  )
}

export default ExploreScreen

const styles = StyleSheet.create({
  container: { flex: 1, marginBottom: -30 },
  headAnimationBox: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: HEADER_HEIGHT,
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchBox: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
})
