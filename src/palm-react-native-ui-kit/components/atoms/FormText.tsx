import { COLOR } from 'palm-core/consts'
import { FONT } from 'palm-react-ui-kit/consts'
import { FontSize, FontType } from 'palm-react-ui-kit/types'
import React, { ReactElement, ReactNode } from 'react'
import { Text, TextProps } from 'react-native'

export type FormTextProps = {
  size?: FontSize
  font?: 'R' | 'B' | 'SB'
  children: ReactNode
  color?: string
} & TextProps

const FormText = ({
  size = 14,
  font = 'R',
  children,
  color = COLOR.black._800,
  style,
  ...rest
}: FormTextProps): ReactElement => {
  const fontStyle = FONT.getFontStyle(`${font}.${size}` as FontType)

  return (
    <Text style={[{ color }, fontStyle, style]} children={children} {...rest} />
  )
}

export default FormText
