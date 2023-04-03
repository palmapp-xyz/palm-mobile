import { StyleProp, TextStyle } from 'react-native'
import { FontType } from 'types'

const getFontStyle = (fontType: FontType): StyleProp<TextStyle> => {
  const weightType = fontType.split('.')[0]

  const style: StyleProp<TextStyle> = {
    fontSize: Number(fontType.split('.')[1]),
    fontWeight: '400',
    lineHeight: 20,
  }

  if (weightType === 'SB') {
    style.fontWeight = '500'
  } else if (weightType === 'B') {
    style.fontWeight = '700'
  }

  switch (style.fontSize) {
    case 12:
      style.lineHeight = 16
      break
    case 14:
      style.lineHeight = 18
      break
    case 16:
      style.lineHeight = 24
      break
    case 18:
      style.lineHeight = 24
      break
    case 20:
      style.lineHeight = 28
      break
    case 24:
      style.lineHeight = 32
      break
    case 32:
      style.lineHeight = 44
      break
    case 40:
      style.lineHeight = 56
      break
  }

  return style
}
export default {
  getFontStyle,
}