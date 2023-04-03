import React, { ReactElement } from 'react'

import Icons from 'components/atoms/Icons'
import { StyleProp, View, ViewStyle } from 'react-native'

const FallbackMediaRenderer = ({
  width,
  height,
  style,
}: {
  width?: number | string
  height?: number | string
  style?: StyleProp<ViewStyle>
}): ReactElement => {
  const dim =
    typeof width === 'number' ? width : typeof height === 'number' ? height : 50

  return (
    <View style={[{ paddingVertical: 10, alignItems: 'center' }, style]}>
      <Icons.CarbonDocumentUnknown width={dim / 2} height={dim / 2} />
    </View>
  )
}

export default FallbackMediaRenderer
