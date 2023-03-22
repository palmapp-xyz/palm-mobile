import React, { ReactElement } from 'react'
import { View, Linking, StyleSheet } from 'react-native'

import Icons from 'components/atoms/Icons'
import styled from 'styled-components/native'

import { MediaRendererProps } from '../atoms/MediaRenderer'
import Card from 'components/atoms/Card'

const StyledText = styled.Text`
  color: 'rgb(138, 147, 155)';
  margin-top: 10px;
`

const FallbackMediaRenderer = ({
  src,
  alt,
  width,
  height,
  style,
  hideAlt,
}: MediaRendererProps & { hideAlt?: boolean }): ReactElement => {
  const dim =
    typeof width === 'number' ? width : typeof height === 'number' ? height : 50
  return (
    <Card
      center={true}
      style={[style, { width: dim, height: dim, padding: 0 }]}>
      <Icons.CarbonDocumentUnknown width={dim / 2} height={dim / 2} />
      {!hideAlt && (
        <StyledText
          numberOfLines={1}
          onPress={async (): Promise<void> => {
            const canOpen = !!src && (await Linking.canOpenURL(src))
            if (canOpen) {
              Linking.openURL(src)
            }
          }}>
          {alt || 'File'}
        </StyledText>
      )}
    </Card>
  )
}

export default FallbackMediaRenderer
