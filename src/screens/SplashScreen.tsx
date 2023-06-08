import Lottie from 'lottie-react-native'
import React, { ReactElement } from 'react'

const SplashScreen = (): ReactElement => {
  return <Lottie source={require('../assets/splash.json')} autoPlay loop />
}

export default SplashScreen
