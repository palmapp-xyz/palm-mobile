import Lottie from 'lottie-react-native'
import { COLOR } from 'palm-core/consts'
import { FormText } from 'palm-react-native-ui-kit/components'
import images from 'palm-ui-kit/assets/images'
import React, { ReactElement, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import RNBootSplash from 'react-native-bootsplash'

import SplashScreen from './SplashScreen'

const UpdateScreen = (props: {
  restartApp: (onlyIfUpdateIsPending?: boolean) => void
  syncUpdate: () => Promise<void>
  upToDate: boolean | undefined
  updateComplete: boolean | undefined
  progress: number
}): ReactElement => {
  const { t } = useTranslation()
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
            source={images.spinner}
            autoPlay
            loop
          />
          <FormText
            color={COLOR.black._400}
            style={{ textAlign: 'center', marginTop: 22 }}
          >
            {t('Update.Message')}
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
