import Lottie from 'lottie-react-native'
import React, { ReactElement } from 'react'

const SplashScreen = (): ReactElement => {
  return (
    <Lottie
      source={require('../assets/splash.json')}
      style={{ width: 208, height: 208, alignSelf: 'center' }}
      autoPlay
      loop
    />
  )
}

export default SplashScreen
