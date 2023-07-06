import { useCallback, useContext } from 'react'
import {
  AndroidSoftInputModes,
  AnimatedContext,
  KeyboardContext,
  KeyboardController,
} from 'react-native-keyboard-controller'

import { useFocusEffect } from '@react-navigation/native'

const useKeyboardAnimation = (): AnimatedContext => {
  useFocusEffect(
    useCallback(() => {
      KeyboardController.setInputMode(
        AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE
      )

      return () => KeyboardController.setDefaultMode()
    }, [])
  )

  const context = useContext(KeyboardContext)

  return context.animated
}

export default useKeyboardAnimation
