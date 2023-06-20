import { COLOR, STYLE } from 'consts'
import React, { ReactElement, ReactNode } from 'react'
import { Text, TextProps } from 'react-native'
import { FontType } from 'types'

export type FormTextProps = {
  fontType?: FontType
  children: ReactNode
  color?: string
} & TextProps

const FormText = ({
  fontType = 'R.16',
  children,
  color = COLOR.black._900,
  style,
  ...rest
}: FormTextProps): ReactElement => {
  const fontStyle = STYLE.getFontStyle(fontType)

  return (
    <Text style={[{ color }, fontStyle, style]} children={children} {...rest} />
  )
}

export default FormText
