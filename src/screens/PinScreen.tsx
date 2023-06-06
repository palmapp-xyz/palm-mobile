import { useToast } from '@sendbird/uikit-react-native-foundation'
import images from 'assets/images'
import { FormText } from 'components'
import { COLOR } from 'consts'
import { getPin, savePin } from 'libs/pin'
import React, { ReactElement, useEffect, useState } from 'react'
import {
  Image,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

const CloseButton = (): ReactElement => {
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
          backgroundColor: '#ccc',
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
}): ReactElement => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
    </View>
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

const PinScreen = (props: {
  type: 'set' | 'auth' | 'reset'
  callback: (result: boolean) => Promise<void>
}): ReactElement => {
  const toast = useToast()

  const [pin, setPin] = useState('')

  const handleInput = (value: string): void => {
    if (pin.length >= 4) {
      return
    }
    const n = pin + value
    setPin(n)
  }

  const handleDelete = (): void => {
    if (pin.length <= 0 && pin.length >= 4) {
      return
    }
    const n = pin.slice(0, -1)
    setPin(n)
  }

  const clearPin = (): void => {
    setPin('')
  }

  useEffect(() => {
    const handlePin = async (): Promise<void> => {
      switch (props.type) {
        case 'auth':
          if (pin.length === 4) {
            const v = await getPin()
            // encrypt?
            const match = pin === v

            clearPin()
            props.callback(match)
          }
          break
        case 'reset':
        case 'set':
          if (pin.length === 4) {
            await savePin(pin)
            toast.show('Your PIN code is successfully set up.')

            clearPin()
            props.callback(true)
          }
          break
      }
    }
    handlePin()
  }, [pin])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLOR.white }}>
      <CloseButton />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <PinTitle title={'Set up your PIN code'} />
        <PinSubTitle
          icon={'alert-circle-outline'}
          title={'Forgot your PIN code?'}
        />
        <View style={{ flexDirection: 'row', marginVertical: 40 }}>
          <PinDot fill={pin.length > 0} />
          <PinDot fill={pin.length > 1} />
          <PinDot fill={pin.length > 2} />
          <PinDot fill={pin.length > 3} />
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
