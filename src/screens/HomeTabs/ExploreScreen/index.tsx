import images from 'assets/images'
import { Container, FormImage, FormInput, Row } from 'components'
import { COLOR } from 'consts'
import useInterest from 'hooks/independent/useInterest'
import useExploreSearch from 'hooks/page/explore/useExploreSearch'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
//import { useAppNavigation } from 'hooks/useAppNavigation'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import {
  Animated,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import RecentlySearched from './RecentlySearched'

import RecommendChat from './RecommendChat'
import RecommendUsers from './RecommendUsers'
import SearchResult from './SearchResult'
import SelectedChannel from './SelectedChannel'

const HEADER_HEIGHT = 72

const ExploreScreen = (): ReactElement => {
  const { navigation } = useAppNavigation()

  const [searchFocused, setSearchFocused] = useState(false)
  const inputRef = useRef<TextInput>(null)

  const useExploreSearchReturn = useExploreSearch()
  const {
    scrollOffsetY,
    inputSearch,
    setInputSearch,
    isSearching,
    onClickConfirm,
  } = useExploreSearchReturn

  const { isLoading: isLoadingInterest, interestList } = useInterest()

  useEffect(() => {
    if (isLoadingInterest === false && interestList.length < 1) {
      navigation.navigate(Routes.InitExplore)
    }
  }, [isLoadingInterest])

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
        ]}
      >
        <Animated.View
          style={{
            opacity: scrollOffsetY.interpolate({
              inputRange: [0, HEADER_HEIGHT],
              outputRange: [1, 0],
              extrapolate: 'clamp',
            }),
          }}
        >
          <Row style={styles.header}>
            <FormImage source={images.palm_logo} size={44} />
          </Row>
        </Animated.View>
        <View style={styles.searchBox}>
          <View style={{ position: 'relative' }}>
            <FormInput
              inputRef={inputRef}
              placeholder="Search by username, tag, chat room name..."
              style={{ paddingRight: 40 }}
              maxLength={20}
              value={inputSearch}
              onChangeText={setInputSearch}
              onFocus={(): void => {
                setSearchFocused(true)
              }}
              onBlur={(): void => {
                setSearchFocused(false)
              }}
              onSubmitEditing={(): void => {
                onClickConfirm()
              }}
              returnKeyType="search"
            />
            <View
              style={{ position: 'absolute', right: 10, top: 8, zIndex: 1 }}
            >
              <TouchableOpacity
                disabled={isSearching}
                onPress={(): void => {
                  inputRef.current?.blur()
                  onClickConfirm()
                }}
              >
                <Ionicon
                  name="ios-search"
                  size={20}
                  color={isSearching ? COLOR.black._100 : COLOR.black._300}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>

      {inputSearch.length > 0 ? (
        <View
          style={{ backgroundColor: 'white', paddingTop: HEADER_HEIGHT + 60 }}
        >
          <SearchResult useExploreSearchReturn={useExploreSearchReturn} />
        </View>
      ) : (
        <ScrollView
          style={{
            backgroundColor: 'white',
            paddingTop: HEADER_HEIGHT + 60,
          }}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
            { useNativeDriver: false }
          )}
        >
          <RecommendChat useExploreSearchReturn={useExploreSearchReturn} />
          <RecommendUsers />
          <View style={{ height: 140 }} />
        </ScrollView>
      )}
      {inputSearch.length > 0 && searchFocused && (
        <View
          style={{
            position: 'absolute',
            top: HEADER_HEIGHT + 60,
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
          }}
        >
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
            ]}
          >
            <RecentlySearched
              inputRef={inputRef}
              useExploreSearchReturn={useExploreSearchReturn}
            />
          </Animated.View>
        </View>
      )}
      {useExploreSearchReturn.selectedChannel && (
        <SelectedChannel
          selectedChannel={useExploreSearchReturn.selectedChannel}
          useExploreSearchReturn={useExploreSearchReturn}
        />
      )}
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
  bottomHeader: {
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  bottomChannelImg: {
    borderRadius: 999,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
})
