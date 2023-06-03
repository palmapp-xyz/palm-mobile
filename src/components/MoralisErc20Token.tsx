import images from 'assets/images'
import { FormImage, FormText, Row } from 'components'
import { COLOR, UTIL } from 'consts'
import useTokenPrice from 'hooks/independent/useTokenPrice'
import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import { Moralis, SupportedNetworkEnum, pToken } from 'types'

const MoralisErc20Token = ({
  item,
  selectedNetwork,
}: {
  item: Moralis.FtItem
  selectedNetwork: SupportedNetworkEnum
}): ReactElement => {
  const { getTokenPrice } = useTokenPrice({
    tokenAddress: item.token_address,
    selectedNetwork,
  })
  const tokenPrice: pToken | undefined = getTokenPrice(item.balance as pToken)

  return (
    <View style={styles.itemCard}>
      <Row style={{ alignItems: 'center', columnGap: 12 }}>
        <FormImage
          source={item.logo ? { uri: item.logo } : images.palm_logo}
          size={28}
        />
        <View>
          <Row>
            <FormText fontType="B.16">
              {UTIL.formatAmountP(item.balance as pToken, {
                toFix: 4,
              })}{' '}
            </FormText>
            <FormText fontType="R.16">{item.symbol}</FormText>
          </Row>
          {tokenPrice && (
            <FormText fontType="R.10" color={COLOR.black._400}>
              {`(≈$${UTIL.formatAmountP(tokenPrice, { toFix: 0 })})`}
            </FormText>
          )}
        </View>
      </Row>
    </View>
  )
}

export default MoralisErc20Token

const styles = StyleSheet.create({
  body: { flex: 1, padding: 20, backgroundColor: 'white', gap: 20 },
  itemCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLOR.black._90005,
    borderRadius: 16,
  },
})
