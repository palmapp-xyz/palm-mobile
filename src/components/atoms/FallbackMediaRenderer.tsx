import Card from 'components/atoms/Card'
import LinkRenderer from 'components/molecules/LinkRenderer'
import { MediaRendererProps } from 'components/molecules/MediaRenderer'
import { COLOR } from 'palm-core/consts'
import React, { ReactElement } from 'react'

import { Icon } from '@sendbird/uikit-react-native-foundation'

const FallbackMediaRenderer = ({
  src,
  alt,
  width,
  height,
  style,
  hideAlt,
}: MediaRendererProps & {
  hideAlt?: boolean
}): ReactElement => {
  const dim =
    typeof width === 'number' ? width : typeof height === 'number' ? height : 50

  return (
    <Card center={true} style={[style, { padding: 0, width, height }]}>
      <Icon icon={'error'} size={dim / 2} color={COLOR.primary._400} />
      {!hideAlt && (
        <LinkRenderer
          src={src}
          alt={alt || 'File'}
          numberOfLines={1}
          textStyle={{ color: 'rgb(138, 147, 155)' }}
          containerStyle={{
            marginTop: 10,
            width: '80%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      )}
    </Card>
  )
}

export default FallbackMediaRenderer
