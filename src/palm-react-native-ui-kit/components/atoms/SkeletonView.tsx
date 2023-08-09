import { COLOR } from 'palm-core/consts'
import React, { ReactElement } from 'react'
import { Animated, Easing } from 'react-native'

const SkeletonView = (props: {
  height?: number
  borderRadius?: number
}): ReactElement => {
  const animation = new Animated.Value(0)
  const startColor = `${COLOR.white}FF`
  const endColor = `${COLOR.white}4C`

  Animated.loop(
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1,
        duration: 800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(animation, {
        toValue: 0,
        duration: 800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }),
    ])
  ).start()

  const backgroundColor = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [startColor, endColor, startColor],
  })

  return (
    <Animated.View
      style={{
        borderRadius: props.borderRadius,
        backgroundColor: backgroundColor,
        height: props.height,
      }}
    />
  )
}

export default SkeletonView
