import Lottie from 'lottie-react-native'
import images from 'palm-ui-kit/assets/images'
import React, { ReactElement } from 'react'
import { Platform, View } from 'react-native'
import ExtraDimensions from 'react-native-extra-dimensions-android'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const SplashScreen = (): ReactElement => {
  const insets = useSafeAreaInsets()
  const softMenuBarHeight = ExtraDimensions.getSoftMenuBarHeight()

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        marginTop: Platform.select({
          android: softMenuBarHeight === 0 ? insets.top : softMenuBarHeight,
        }),
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
