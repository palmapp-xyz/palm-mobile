import { COLOR } from 'palm-core/consts'
import React from 'react'
import { Pressable, StyleProp, ViewStyle } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const ChannelUserControlButton = React.memo(
  ({
    onToggleChannelUserControl,
    style,
  }: {
    onToggleChannelUserControl?: () => void
    style?: StyleProp<ViewStyle>
  }) => (
    <Pressable
      style={style}
      onPress={(): void => {
        onToggleChannelUserControl?.()
      }}
    >
      <MaterialIcons name="more-horiz" color={COLOR.black._800} size={28} />
    </Pressable>
  )
)

export default ChannelUserControlButton
