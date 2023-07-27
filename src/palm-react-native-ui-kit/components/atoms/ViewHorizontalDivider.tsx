import { COLOR } from 'palm-core/consts'
import React, { ReactElement } from 'react'
import { ColorValue, View } from 'react-native'

const ViewHorizontalDivider = ({
  height,
  color,
}: {
  height?: number
  color?: ColorValue
}): ReactElement => (
  <View
    style={{
      height: height ?? 1,
      backgroundColor: color ?? COLOR.black._90005,
    }}
  />
)

export default ViewHorizontalDivider
