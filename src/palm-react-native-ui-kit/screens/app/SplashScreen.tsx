import Lottie from 'lottie-react-native'
import images from 'palm-ui-kit/assets/images'
import React, { ReactElement } from 'react'

const SplashScreen = (): ReactElement => {
  return (
    <Lottie
      source={images.splash}
      style={{ width: 208, height: 208, alignSelf: 'center' }}
      autoPlay
      loop
    />
  )
}

export default SplashScreen
