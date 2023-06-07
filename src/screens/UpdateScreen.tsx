import { FormImage, FormText } from 'components'
import { COLOR } from 'consts'
import React, { ReactElement, useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'

import images from 'assets/images'
import RNBootSplash from 'react-native-bootsplash'

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
    if (upToDate === false) {
      RNBootSplash.getVisibilityStatus().then(visibility => {
        visibility === 'visible' &&
          RNBootSplash.hide({ fade: true, duration: 500 })
      })
    }
  }, [upToDate])

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
        <ActivityIndicator size="small" color={COLOR.primary._400} />
      ) : (
        <>
          <FormImage
            source={images.palm_logo}
            size={74}
            style={{ alignSelf: 'center', margin: 22 }}
          />
          <FormText
            fontType="R.14"
            color={COLOR.black._400}
            style={{ textAlign: 'center' }}
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
