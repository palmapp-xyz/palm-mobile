import React, { ReactElement } from 'react'
import { Image, ImageProps } from 'react-native'

type FormImageProps = {
  size?: number
} & ImageProps
const FormImage = (props: FormImageProps): ReactElement => {
  const { size = 20, style, ...rest } = props

  return <Image style={[{ width: size, height: size }, style]} {...rest} />
}

export default FormImage
