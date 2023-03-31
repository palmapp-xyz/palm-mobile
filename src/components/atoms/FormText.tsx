import React, { ReactElement, ReactNode } from 'react'
import { STYLE } from 'consts'
import { Text, TextProps } from 'react-native'
import { FontType } from 'types'

type FormTextProps = {
  fontType?: FontType
  children: ReactNode
  color?: string
} & TextProps

const FormText = ({
  fontType = 'R.16',
  children,
  color,
  style,
  ...rest
}: FormTextProps): ReactElement => {
  const fontStyle = STYLE.getFontStyle(fontType)

  return (
    <Text style={[{ color }, fontStyle, style]} children={children} {...rest} />
  )
}

export default FormText
