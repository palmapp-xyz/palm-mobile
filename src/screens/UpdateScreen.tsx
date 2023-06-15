import { FormText } from 'components'
import { COLOR } from 'consts'
import Lottie from 'lottie-react-native'
import React, { ReactElement, useEffect } from 'react'
import { View } from 'react-native'
import RNBootSplash from 'react-native-bootsplash'
import SplashScreen from './SplashScreen'

const updateMessage =
  'There are app updates.\nPlease wait until the update is complete.\n\nUpdate completed.\nPalm app will be restarted.'

const UpdateScreen = (props: {
  restartApp: (onlyIfUpdateIsPending?: boolean) => void
  syncUpdate: () => Promise<void>
  upToDate: boolean | undefined
  updateComplete: boolean | undefined
  progress: number
}): ReactElement => {
  const { restartApp, upToDate, updateComplete, progress } = props

  useEffect(() => {
    RNBootSplash.hide({ fade: false })
  }, [])

  useEffect(() => {
    if (updateComplete) {
      restartApp()
    }
  }, [updateComplete])

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLOR.white,
        justifyContent: 'center',
      }}
    >
      {upToDate === undefined ? (
        <SplashScreen />
      ) : (
        <>
          <Lottie
            style={{
              width: 74,
              height: 74,
              alignSelf: 'center',
            }}
            source={require('../assets/spinner.json')}
            autoPlay
            loop
          />
          <FormText
            fontType="R.14"
            color={COLOR.black._400}
            style={{ textAlign: 'center', marginTop: 22 }}
          >
            {`${updateMessage}`}
          </FormText>
          <View
            style={{
              flexDirection: 'column',
              marginVertical: 32,
              marginHorizontal: 64,
              backgroundColor: COLOR.black._50,
              height: 8,
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                alignSelf: 'stretch',
                width: `${progress * 100}%`,
                height: '100%',
                borderRadius: 4,
                backgroundColor: COLOR.primary._400,
              }}
            />
          </View>
        </>
      )}
    </View>
  )
}

export default UpdateScreen
