import images from 'assets/images'
import { FormText } from 'components'
import { COLOR } from 'consts'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useToast from 'hooks/useToast'
import { Routes } from 'libs/navigation'
import { getNewPin, getPin, resetNewPin, saveNewPin, savePin } from 'libs/pin'
import React, { ReactElement, useEffect, useState } from 'react'
import {
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'

const CloseButton = (props: {
  onPress?: () => Promise<void>
}): ReactElement => {
  return (
    <View
      style={{
        height: 72,
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginHorizontal: 20,
      }}
    >
      <TouchableOpacity
        style={{
          width: 38,
          height: 38,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={(): void => {
          props.onPress && props.onPress()
        }}
      >
        <Ionicons name="close" size={28} color={COLOR.black._900} />
      </TouchableOpacity>
    </View>
  )
}

const PinTitle = (props: { title: string }): ReactElement => {
  return (
    <FormText fontType="B.20" color={COLOR.black._900} style={{ margin: 12 }}>
      {props.title}
    </FormText>
  )
}

const PinSubTitle = (props: {
  icon?: string
  title?: string
  onPress?: () => Promise<void>
}): ReactElement => {
  return (
    <TouchableOpacity
      style={{ flexDirection: 'row', alignItems: 'center' }}
      onPress={props.onPress}
    >
      {props.icon && (
        <Ionicons
          name={props.icon}
          size={16}
          color={COLOR.black._500}
          style={{ marginRight: 4 }}
        />
      )}
      <FormText fontType="R.14" color={COLOR.black._500}>
        {props.title}
      </FormText>
    </TouchableOpacity>
  )
}

const PinDot = (props: { fill: boolean }): ReactElement => {
  const backgroundColor = props.fill ? COLOR.primary._400 : COLOR.black._100

  return (
    <View
      style={{
        width: 16,
        height: 16,
        backgroundColor,
        borderRadius: 16 / 2,
        margin: 14,
      }}
    />
  )
}

const PinButton = (
  props:
    | { value: string; handleInput: (value: string) => void }
    | { delete: boolean; handleDelete: () => void }
    | { disabled: boolean }
): ReactElement => {
  const [backgroundColor, setBackgroundColor] = useState<string | undefined>(
    undefined
  )

  const onPressIn = (): void => {
    setBackgroundColor(COLOR.black._90005)

    if ('value' in props) {
      props.handleInput(props.value)
    }
    if ('delete' in props) {
      props.handleDelete()
    }
  }
  const onPressOut = (): void => {
    setTimeout(() => setBackgroundColor(undefined), 50)
  }

  return (
    <TouchableWithoutFeedback
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={props.hasOwnProperty('disabled')}
    >
      <View
        style={{
          width: 84,
          height: 64,
          borderRadius: 10,
          backgroundColor,
          alignItems: 'center',
          justifyContent: 'center',
          marginVertical: 12,
          marginHorizontal: 8,
        }}
      >
        {'delete' in props && (
          <Image source={images.pin_delete} style={{ width: 32, height: 32 }} />
        )}
        {'value' in props && (
          <FormText fontType="B.32" color={COLOR.black._900}>
            {props.value}
          </FormText>
        )}
      </View>
    </TouchableWithoutFeedback>
  )
}

const PIN_COUNT = 4

const PinScreen = (): ReactElement => {
  const { params } = useAppNavigation<Routes.Pin>()
  const { type, result: resultCallback, cancel } = params

  const [pinType, setPinType] = useState<'set' | 'auth' | 'reset'>(type)
  const toast = useToast()

  const [inputPin, setInputPin] = useState('')
  const [pinConfigurePhase, setPinConfigurePhase] = useState<
    'input' | 'confirm' | 'done'
  >('input')

  const handleInput = (value: string): void => {
    if (inputPin.length >= PIN_COUNT) {
      return
    }
    const n = inputPin + value
    setInputPin(n)
  }

  const handleDelete = (): void => {
    if (inputPin.length <= 0 && inputPin.length >= PIN_COUNT) {
      return
    }
    const n = inputPin.slice(0, -1)
    setInputPin(n)
  }

  const clearInputPin = (): void => {
    setInputPin('')
  }

  useEffect(() => {
    clearInputPin()
    resetNewPin()
  }, [])

  useEffect(() => {
    setPinType(type)
  }, [type])

  useEffect(() => {
    const handlePin = async (): Promise<void> => {
      switch (pinType) {
        case 'auth':
          if (inputPin.length === 4) {
            const v = await getPin()
            const match = !v || inputPin === v

            clearInputPin()
            resultCallback && resultCallback(match)
          }
          break
        case 'reset':
        case 'set':
          if (inputPin.length === 4) {
            const newPin = await getNewPin()

            if (newPin === '') {
              await saveNewPin(inputPin)
              setPinConfigurePhase('confirm')
            } else {
              if (newPin === inputPin) {
                // match
                await savePin(inputPin)

                toast.show('Your PIN code is successfully set up.', {
                  color: 'green',
                  icon: 'check',
                })

                if (pinType === 'reset') {
                  setPinType('auth')
                } else {
                  setPinConfigurePhase('done')
                  resultCallback && resultCallback(true)
                }
              } else {
                // mismatch

                toast.show('PIN mismatch', {
                  color: 'red',
                  icon: 'info',
                })
                setPinConfigurePhase('input')
                // callback && callback(false)
              }

              resetNewPin()
            }

            clearInputPin()
          }
          break
      }
    }
    handlePin()
  }, [inputPin])

  const onResetPin = (): void => {
    // push seed or private key -> if pass -> reset phase.
  }

  const TITLE = {
    setup: { title: 'Set up your PIN code' },
    confirm: { title: 'Confirm your PIN code' },
    enter: { title: 'Enter your PIN code' },
    none: { title: '' },
  }
  const TITLE_SUB = {
    setup: { title: 'This action requires a PIN code setting.' },
    confirm: { title: '' },
    enter: {
      title: 'Forgot your PIN code?',
      icon: 'alert-circle-outline',
      onPress: onResetPin,
    },
    none: { title: '' },
  }

  const title =
    pinType === 'auth'
      ? TITLE.enter
      : pinConfigurePhase === 'input' // set or reset
      ? TITLE.setup
      : pinConfigurePhase === 'confirm' // set or reset
      ? TITLE.confirm
      : TITLE.confirm

  const subTitle =
    pinType === 'auth'
      ? TITLE_SUB.enter
      : pinConfigurePhase === 'input' // set or reset
      ? TITLE_SUB.setup
      : pinConfigurePhase === 'confirm' // set or reset
      ? TITLE_SUB.confirm
      : TITLE_SUB.confirm

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLOR.white }}>
      <CloseButton onPress={cancel} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <PinTitle {...title} />
        <PinSubTitle {...subTitle} />
        <View style={{ flexDirection: 'row', marginVertical: 40 }}>
          {[...Array(PIN_COUNT).keys()].map((_, i) => (
            <PinDot fill={inputPin.length > i} key={i} />
          ))}
        </View>

        <View style={{ flexDirection: 'row' }}>
          <PinButton value={'1'} handleInput={handleInput} />
          <PinButton value={'2'} handleInput={handleInput} />
          <PinButton value={'3'} handleInput={handleInput} />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <PinButton value={'4'} handleInput={handleInput} />
          <PinButton value={'5'} handleInput={handleInput} />
          <PinButton value={'6'} handleInput={handleInput} />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <PinButton value={'7'} handleInput={handleInput} />
          <PinButton value={'8'} handleInput={handleInput} />
          <PinButton value={'9'} handleInput={handleInput} />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <PinButton disabled />
          <PinButton value={'0'} handleInput={handleInput} />
          <PinButton delete handleDelete={handleDelete} />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default PinScreen
