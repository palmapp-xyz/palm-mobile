import FormText from 'components/atoms/FormText'
import { COLOR } from 'core/consts'
import { t } from 'i18next'
import React, { ReactElement } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

const NftSoldTag = ({
  position = 'right',
  style,
}: {
  position?: 'left' | 'right'
  style?: StyleProp<ViewStyle>
}): ReactElement => {
  return (
    <View
      style={[
        styles.floatRightLabel,
        {
          backgroundColor: COLOR.error,
        },
        position === 'left' ? { left: 0 } : { right: 0 },
        style,
      ]}
    >
      <FormText font={'SB'} color="white">
        {t('Nft.ListNftMessageSold')}
      </FormText>
    </View>
  )
}

export default NftSoldTag

const styles = StyleSheet.create({
  floatRightLabel: {
    position: 'absolute',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    margin: 5,
  },
})
