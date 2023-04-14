import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  Animated,
  BackHandler,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import _ from 'lodash'
import Icon from 'react-native-vector-icons/Ionicons'

import { COLOR } from 'consts'
import images from 'assets/images'

import { Container, FormButton, FormImage, FormText, Row } from 'components'
import useInitExplore, { InterestItem } from 'hooks/page/explore/useInitExplore'
import { useAppNavigation } from 'hooks/useAppNavigation'

const InitExploreScreen = (): ReactElement => {
  const { navigation } = useAppNavigation()
  const { interestList, selectedInterestList, updateSelectedInterestList } =
    useInitExplore()
  const [showStep, setShowStep] = useState<0 | 1 | 2 | 3>(0)

  const scaleText1 = useRef(new Animated.Value(0)).current
  const fadeInText1 = useRef(new Animated.Value(0)).current
  const moveText1 = useRef(new Animated.Value(0)).current

  const fadeInText2 = useRef(new Animated.Value(0)).current
  const moveText2 = useRef(new Animated.Value(0)).current

  const fadeInText3 = useRef(new Animated.Value(0)).current
  const moveText3 = useRef(new Animated.Value(0)).current

  const showText1 = (): void => {
    if (showStep !== 0) {
      return
    }

    setShowStep(1)
    Animated.timing(fadeInText1, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
    Animated.timing(moveText1, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  const showText2 = (): void => {
    if (showStep !== 1) {
      return
    }

    setShowStep(2)
    Animated.timing(scaleText1, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
    Animated.timing(fadeInText2, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
    Animated.timing(moveText2, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
    Animated.timing(moveText1, {
      toValue: 2,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  const showText3 = (): void => {
    if (showStep !== 2) {
      return
    }

    setShowStep(3)
    Animated.timing(fadeInText3, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
    Animated.timing(moveText3, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  useEffect(() => {
    setTimeout(() => {
      showText1()
    }, 900)
    setTimeout(() => {
      showText2()
    }, 900)
    setTimeout(() => {
      showText3()
    }, 900)
  }, [showStep])

  useEffect(() => {
    const backAction = (): boolean => {
      return true
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    )

    return () => backHandler.remove()
  }, [])

  const RenderItem = useCallback(
    ({ item }: { item: InterestItem }): ReactElement => {
      const selected = selectedInterestList.includes(item.id)

      return (
        <TouchableOpacity
          onPress={(): void => {
            updateSelectedInterestList(item.id)
          }}>
          <Row
            style={[
              styles.interestItem,
              { backgroundColor: selected ? COLOR.main_light : 'white' },
            ]}>
            {!!item.img && (
              <FormImage
                source={item.img}
                size={18}
                style={{ marginRight: 8 }}
              />
            )}
            <FormText
              fontType="SB.14"
              color={selected ? COLOR.primary._400 : COLOR.gray._400}>
              {item.title}
            </FormText>
          </Row>
        </TouchableOpacity>
      )
    },
    [selectedInterestList]
  )

  return (
    <Container style={styles.container}>
      <View style={styles.header}>
        <FormImage source={images.palm_logo} size={44} />
      </View>

      <TouchableWithoutFeedback
        onPress={(): void => {
          switch (showStep) {
            case 0:
              showText1()
              break

            case 1:
              showText2()
              break
          }
        }}>
        <View style={styles.contents}>
          <Animated.View
            style={[
              styles.text1Box,
              {
                opacity: fadeInText1,
                transform: [
                  {
                    translateY: moveText1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 0],
                    }),
                  },
                  {
                    translateX: moveText1.interpolate({
                      inputRange: [0, 1, 2],
                      outputRange: [0, 0, -70],
                    }),
                  },
                  {
                    scale: scaleText1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0.6],
                    }),
                  },
                ],
              },
            ]}>
            <FormText
              fontType="B.24"
              color={showStep === 1 ? COLOR.gray._900 : COLOR.gray._400}>
              {'Hi, there!\nWelcome to Palm.'}
            </FormText>
          </Animated.View>
          <Animated.View
            style={[
              styles.text2Box,
              {
                opacity: fadeInText2,
                transform: [
                  {
                    translateY: moveText2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 0],
                    }),
                  },
                ],
              },
            ]}>
            <FormText fontType="B.24">
              {'Tell us what you\ninterested in.'}
            </FormText>
          </Animated.View>
          <Animated.View
            style={[
              {
                opacity: fadeInText3,
                transform: [
                  {
                    translateY: moveText3.interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 0],
                    }),
                  },
                ],
              },
            ]}>
            {showStep === 3 && (
              <>
                <View style={styles.text3Box}>
                  {_.map(interestList, (item, index) => (
                    <RenderItem key={`interestList-${index}`} item={item} />
                  ))}
                </View>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  onPress={(): void => {
                    navigation.goBack()
                  }}>
                  <Icon
                    name="ios-arrow-forward"
                    size={14}
                    color={COLOR.gray._500}
                  />
                  <FormText fontType="R.12" color={COLOR.gray._500}>
                    Skip this step
                  </FormText>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.footer}>
        <FormButton
          disabled={selectedInterestList.length < 1}
          onPress={(): void => {
            navigation.goBack()
          }}>
          It's all done
        </FormButton>
      </View>
    </Container>
  )
}

export default InitExploreScreen

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 72,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  text1Box: {
    paddingBottom: 8,
  },
  text2Box: {
    marginTop: -20,
  },
  text3Box: {
    paddingTop: 32,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingBottom: 16,
  },
  contents: {
    paddingTop: 12,
    paddingHorizontal: 20,
    flex: 1,
  },
  interestItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLOR.gray._50,
    alignSelf: 'flex-start',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: `${COLOR.gray._900}${COLOR.opacity._10}`,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
})
