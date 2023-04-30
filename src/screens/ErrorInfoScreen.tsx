import React, { ReactElement } from 'react'
import { SectionList, View } from 'react-native'

import { Button, Palette, Text } from '@sendbird/uikit-react-native-foundation'

import type { ErrorBoundaryProps } from '@sendbird/uikit-react-native'
const ErrorInfoScreen = (props: ErrorBoundaryProps): ReactElement => {
  const renderHeader = (subProps: {
    section: { title: string }
  }): ReactElement => (
    <Text
      body2
      color={Palette.onBackgroundLight01}
      style={{
        backgroundColor: Palette.background300,
        paddingHorizontal: 8,
        paddingVertical: 4,
      }}>
      {subProps.section.title}
    </Text>
  )
  const renderItem = (subProps: { item?: string }): ReactElement => (
    <Text caption2 color={Palette.onBackgroundLight02} style={{ padding: 12 }}>
      {subProps.item}
    </Text>
  )

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <SectionList
        bounces={false}
        style={{
          width: '80%',
          maxHeight: 400,
          borderRadius: 8,
          marginBottom: 16,
        }}
        contentContainerStyle={{ backgroundColor: Palette.background100 }}
        stickySectionHeadersEnabled
        sections={[
          {
            title: 'Error name',
            data: [props.error.name],
            renderItem,
          },
          {
            title: 'Error message',
            data: [props.error.message],
            renderItem,
          },
          {
            title: 'Error stack',
            data: [props.error.stack],
            renderItem,
          },
          {
            title: 'Error info',
            data: [props.errorInfo.componentStack],
            renderItem,
          },
        ]}
        renderSectionHeader={renderHeader}
      />
      <Button onPress={props.reset} style={{ width: '80%' }}>
        {'Reset'}
      </Button>
    </View>
  )
}

export default ErrorInfoScreen
