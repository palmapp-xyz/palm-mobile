import _ from 'lodash'
import { COLOR } from 'palm-core/consts'
import { UTIL } from 'palm-core/libs'
import { SupportedNetworkEnum } from 'palm-core/types'
import { FormImage, FormText, Row } from 'palm-react-native-ui-kit/components'
import React, { ReactElement } from 'react'
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'

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
        (network: SupportedNetworkEnum) => {
          const selected = network === selectedNetwork
          return (
            <TouchableOpacity
              key={network}
              style={[
                styles.optionItem,
                { backgroundColor: selected ? COLOR.main_light : 'white' },
              ]}
              onPress={(): void => onNetworkSelected?.(network)}
            >
              <FormImage source={UTIL.getNetworkLogo(network)} size={16} />
              <FormText
                font={'SB'}
                color={selected ? COLOR.primary._400 : COLOR.black._400}
              >
                {_.capitalize(network)}
              </FormText>
            </TouchableOpacity>
          )
        }
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
  optionItem: {
    flexDirection: 'row',
    columnGap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLOR.black._50,
  },
})
