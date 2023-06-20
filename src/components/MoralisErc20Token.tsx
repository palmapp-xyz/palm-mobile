import images from 'assets/images'
import { FormImage, FormText, Row } from 'components'
import { COLOR, UTIL } from 'consts'
import { getTokenBalanceInUSD } from 'libs/utils'
import React, { ReactElement, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { Moralis, pToken } from 'types'

import { Icon } from '@sendbird/uikit-react-native-foundation'
import { useTranslation } from 'react-i18next'

const MoralisErc20Token = ({
  item,
  value,
}: {
  item: Moralis.FtItem
  value: pToken
}): ReactElement => {
  const tokenValue = useMemo(
    () => getTokenBalanceInUSD(value, item.price),
    [item]
  )
  const { t } = useTranslation()

  return (
    <View style={styles.itemCard}>
      <Row style={{ alignItems: 'center', columnGap: 12 }}>
        {item.logo ? (
          <FormImage
            source={item.logo ? { uri: item.logo } : images.palm_logo}
            size={28}
          />
        ) : (
          <Icon icon={'error'} size={24} color={COLOR.primary._300} />
        )}
        <View>
          <Row>
            <FormText fontType="B.16">
              {UTIL.formatAmountP(value, {
                toFix: 4,
              })}{' '}
            </FormText>
            <FormText fontType="R.16">{item.symbol}</FormText>
          </Row>
          <FormText fontType="R.12" color={COLOR.black._400}>
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
