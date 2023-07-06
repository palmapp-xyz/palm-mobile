import React, { ReactElement } from 'react'
import FastImage, { FastImageProps } from 'react-native-fast-image'

type FormImageProps = {
  size?: number
} & FastImageProps
const FormImage = (props: FormImageProps): ReactElement => {
  const { size = 20, style, ...rest } = props

  return <FastImage style={[{ width: size, height: size }, style]} {...rest} />
}

export default FormImage
