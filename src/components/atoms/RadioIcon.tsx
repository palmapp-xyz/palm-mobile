import React, { ReactElement } from 'react'
import { View } from 'react-native'

import { COLOR } from 'consts'

const RadioIcon = ({ selected }: { selected: boolean }): ReactElement => (
  <View
    style={{
      borderColor: COLOR.primary._400,
      borderWidth: selected ? 5 : 1,
      borderRadius: 999,
      width: 16,
      height: 16,
    }}
  />
)

export default RadioIcon
