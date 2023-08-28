import AsyncStorage from '@react-native-async-storage/async-storage'
import { COLOR } from 'palm-core/consts'
import React, { ReactElement, useEffect, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import FormText from './FormText'

const BalloonMessage = ({
  text,
  x,
  y,
  showOnceKey,
}: {
  text: string
  x?: number
  y?: number
  showOnceKey?: string
}): ReactElement => {
  const key = 'BALLOON_MESSAGE_SHOW_ONCE_' + showOnceKey
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (showOnceKey) {
      AsyncStorage.getItem(key).then(value => {
        setVisible(value === 'true' ? false : true)
      })
    } else {
      setVisible(true)
    }
  }, [])

  const onPressBalloon = (): void => {
    setVisible(false)
    if (showOnceKey) {
      AsyncStorage.setItem(key, 'true')
    }
  }

  if (!visible) {
    return <></>
  }

  return (
    <Pressable
      onPress={onPressBalloon}
      style={[
        balloonStyles.container,
        {
          top: x ?? 0,
          left: y ?? 0,
        },
      ]}
    >
      <Svg width="233" height="8" viewBox="0 0 233 8" fill="none">
        <Path
          d="M19.6 3.2C20.8 1.6 23.2 1.6 24.4 3.2L28 8H16L19.6 3.2Z"
          fill="#D7E4FF"
        />
      </Svg>
      <View style={balloonStyles.background}>
        <FormText color={COLOR.primary._400} style={{ lineHeight: 18 }}>
          {text}
        </FormText>
      </View>
    </Pressable>
  )
}

const balloonStyles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  background: {
    minWidth: 200,
    minHeight: 34,
    borderRadius: 14,
    backgroundColor: COLOR.main_light,
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: 'center',
  },
})

export default BalloonMessage
