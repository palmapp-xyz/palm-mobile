import React, { ReactElement } from 'react'
import { StyleSheet, StyleProp, ViewStyle } from 'react-native'

import { SupportedNetworkEnum } from 'types'

import { FormButton, Row } from 'components'

const SupportedNetworkRow = ({
  selectedNetwork,
  onNetworkSelected,
  style,
}: {
  selectedNetwork: SupportedNetworkEnum
  onNetworkSelected?: (selectedNetwork: SupportedNetworkEnum) => void
  style?: StyleProp<ViewStyle>
}): ReactElement => {
  return (
    <Row style={[styles.rowButtons, style]}>
      {Object.values(SupportedNetworkEnum).map(
        (network: SupportedNetworkEnum) => (
          <FormButton
            key={network}
            containerStyle={{
              flex: 1,
            }}
            figure={network === selectedNetwork ? 'primary' : 'secondary'}
            size="sm"
            onPress={(): void => onNetworkSelected?.(network)}>
            {network}
          </FormButton>
        )
      )}
    </Row>
  )
}

export default SupportedNetworkRow

const styles = StyleSheet.create({
  rowButtons: {
    width: '100%',
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    borderRadius: 10,
    columnGap: 10,
  },
})
