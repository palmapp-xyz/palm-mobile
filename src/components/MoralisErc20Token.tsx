import images from 'assets/images'
import { FormImage, FormText, Row } from 'components'
import { COLOR, UTIL } from 'consts'
import { getTokenBalanceInUSD } from 'libs/utils'
import React, { ReactElement, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { Moralis, SupportedNetworkEnum, pToken } from 'types'

import { Icon } from '@sendbird/uikit-react-native-foundation'

const MoralisErc20Token = ({
  item,
}: {
  item: Moralis.FtItem
  selectedNetwork: SupportedNetworkEnum
}): ReactElement => {
  const tokenValue = useMemo(
    () => getTokenBalanceInUSD(item.balance, item.price),
    [item]
  )

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
              {UTIL.formatAmountP(item.balance as pToken, {
                toFix: 4,
              })}{' '}
            </FormText>
            <FormText fontType="R.16">{item.symbol}</FormText>
          </Row>
          <FormText fontType="R.10" color={COLOR.black._400}>
            {`(≈ $${
              tokenValue ? UTIL.formatAmountP(tokenValue, { toFix: 0 }) : '?'
            })`}
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
