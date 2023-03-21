import React, { ReactElement } from 'react'
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native'

import { SupportedNetworkEnum } from 'types'

import { FormButton, Row } from 'components'

const SupportedNetworkRow = ({
  selectedNetwork,
  onNetworkSelected,
  style = {},
}: {
  selectedNetwork: SupportedNetworkEnum
  onNetworkSelected?: (selectedNetwork: SupportedNetworkEnum) => void
  style?: StyleProp<ViewStyle> | undefined
}): ReactElement => {
  return (
    <View style={style}>
      <Row style={styles.rowButtons}>
        {Object.values(SupportedNetworkEnum).map(
          (network: SupportedNetworkEnum) => (
            <FormButton
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
    </View>
  )
}

export default SupportedNetworkRow

const styles = StyleSheet.create({
  rowButtons: {
    width: '100%',
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    padding: 5,
    borderRadius: 10,
    columnGap: 10,
  },
})
