import Lottie from 'lottie-react-native'
import images from 'palm-ui-kit/assets/images'
import React, { ReactElement } from 'react'
import { View } from 'react-native'
import ExtraDimensions from 'react-native-extra-dimensions-android'

const SplashScreen = (): ReactElement => {
  const softMenuBarHeight = ExtraDimensions.getSoftMenuBarHeight()

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        marginBottom: -softMenuBarHeight,
      }}
    >
      <Lottie
        source={images.splash}
        style={{ width: 208, height: 208, alignSelf: 'center' }}
        autoPlay
        loop
      />
    </View>
  )
}

export default SplashScreen
