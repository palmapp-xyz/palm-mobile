import React, { ReactElement } from 'react'

import Icons from 'components/atoms/Icons'

import { MediaRendererProps } from '../atoms/MediaRenderer'
import Card from 'components/atoms/Card'
import LinkRenderer from './LinkRenderer'

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
      <Icons.CarbonDocumentUnknown width={dim / 2} height={dim / 2} />
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
