import MediaRenderer from 'components/molecules/MediaRenderer'
import { COLOR } from 'palm-core/consts'
import React, { ReactElement, useState } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import {
  createStyleSheet,
  Icon,
  useUIKitTheme,
} from '@sendbird/uikit-react-native-foundation'
import { conditionChaining } from '@sendbird/uikit-utils'

import AvatarGroup from './AvatarGroup'
import AvatarIcon from './AvatarIcon'

type SubComponents = {
  Group: typeof AvatarGroup
  Icon: typeof AvatarIcon
}
type Props = {
  uri?: string
  size?: number
  square?: boolean
  muted?: boolean
  containerStyle?: StyleProp<ViewStyle>
}
const Avatar: ((props: Props) => JSX.Element) & SubComponents = ({
  uri,
  square,
  muted = false,
  size = 56,
  containerStyle,
}) => {
  const { colors } = useUIKitTheme()
  const [loadFailure, setLoadFailure] = useState(false)

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: square ? 0 : size / 2,
          backgroundColor: COLOR.white,
          borderWidth: 1,
          borderColor: COLOR.black._50,
        },
        containerStyle,
      ]}
    >
      {conditionChaining(
        [Boolean(uri) && !loadFailure],
        [
          <MediaRenderer
            width={size}
            height={size}
            style={{
              borderRadius: size / 2,
            }}
            src={uri}
            onError={(): void => setLoadFailure(true)}
          />,
          <Icon icon={'user'} size={size / 2} color={colors.onBackground03} />,
        ]
      )}
      {muted && <MutedOverlay size={size} />}
    </View>
  )
}

const MutedOverlay = ({ size }: { size: number }): ReactElement => {
  const { palette } = useUIKitTheme()
  return (
    <View style={[styles.container, StyleSheet.absoluteFill]}>
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: palette.primary300, opacity: 0.5 },
        ]}
      />
      <Icon
        color={palette.onBackgroundDark01}
        icon={'mute'}
        size={size * 0.72}
      />
    </View>
  )
}

const styles = createStyleSheet({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
})

Avatar.Group = AvatarGroup
Avatar.Icon = AvatarIcon
export default Avatar
