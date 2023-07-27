import { COLOR } from 'palm-core/consts'
import { UTIL } from 'palm-core/libs'
import { Moralis, pToken } from 'palm-core/types'
import { FormImage, FormText, Row } from 'palm-react-native-ui-kit/components'
import React, { ReactElement, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { Icon } from '@sendbird/uikit-react-native-foundation'

const MoralisErc20Token = ({
  item,
  value,
  style,
}: {
  item: Moralis.FtItem
  value: pToken
  style?: StyleProp<ViewStyle>
}): ReactElement => {
  const tokenValue = useMemo(
    () => UTIL.getTokenBalanceInUSD(value, item.price),
    [item]
  )
  const { t } = useTranslation()

  return (
    <View style={[styles.itemCard, style]}>
      <Row style={{ alignItems: 'center', columnGap: 12 }}>
        {item.logo ? (
          <FormImage source={{ uri: item.logo }} size={28} />
        ) : (
          <Icon icon={'error'} size={24} color={COLOR.primary._300} />
        )}
        <View>
          <Row>
            <FormText size={16} font={'B'}>
              {UTIL.formatAmountP(value, {
                toFix: 4,
              })}{' '}
            </FormText>
            <FormText size={14} style={{ marginTop: 3 }}>
              {item.symbol}
            </FormText>
          </Row>
          <FormText size={14} color={COLOR.black._400}>
            {t('Common.UsdPrice', {
              price: tokenValue
                ? UTIL.formatAmountP(tokenValue, { toFix: 2 })
                : '?',
            })}
          </FormText>
        </View>
      </Row>
    </View>
  )
}

export default MoralisErc20Token

const styles = StyleSheet.create({
  itemCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLOR.black._90005,
    borderRadius: 16,
    marginVertical: 2,
  },
})
