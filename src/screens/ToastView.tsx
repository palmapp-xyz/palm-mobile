import { FormText } from 'components'
import { COLOR } from 'consts'
import React from 'react'
import { View } from 'react-native'
import { ToastProps } from 'react-native-toast-notifications/lib/typescript/toast'
import { Props } from 'react-native-toast-notifications/lib/typescript/toast-container'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export const defaultToastProviderOptions: Props = {
  placement: 'top',
  duration: 3000,
  animationType: 'slide-in',
  animationDuration: 250,
  offset: 50,
}

export type ToastIconType = 'more' | 'check' | 'info'
export type ToastColorType = 'blue' | 'green' | 'yellow' | 'red'

export type ToastType = {
  icon: ToastIconType
  color: ToastColorType
}

export const renderToast = (toast: ToastProps): JSX.Element => {
  return <ToastView {...toast} />
}

const ToastView = (toast: ToastProps): JSX.Element => {
  const { data } = toast

  const iconName =
    data?.icon === 'more'
      ? 'more-horiz'
      : data?.icon === 'check'
      ? 'check-circle'
      : data?.icon === 'info'
      ? 'info'
      : ''

  const messageColor =
    data?.color === 'blue'
      ? COLOR.blue
      : data?.color === 'green'
      ? COLOR.green
      : data?.color === 'yellow'
      ? COLOR.yellow
      : data?.color === 'red'
      ? COLOR.red
      : '#ffffffff'

  const backgroundColor =
    data?.color === 'blue'
      ? `${COLOR.blue}${COLOR.opacity._07}`
      : data?.color === 'green'
      ? `${COLOR.green}${COLOR.opacity._07}`
      : data?.color === 'yellow'
      ? `${COLOR.yellow}${COLOR.opacity._07}`
      : data?.color === 'red'
      ? `${COLOR.red}${COLOR.opacity._07}`
      : '#ffffffff'

  return (
    <View
      style={{
        width: '100%',
        margin: 4,
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: COLOR.white,
          marginHorizontal: 20,
          borderRadius: 16,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            padding: 16,
            borderRadius: 16,
            backgroundColor,
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              marginRight: 8,
              alignItems: 'flex-start',
            }}
          >
            <MaterialIcons name={iconName} color={messageColor} size={20} />
          </View>
          <FormText
            font={'SB'}
            color={messageColor}
            style={{ flex: 1, alignSelf: 'center' }}
          >
            {toast.message}
          </FormText>
        </View>
      </View>
    </View>
  )
}

export default ToastView
