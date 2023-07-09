import { COLOR } from 'palm-core/consts'
import { UTIL } from 'palm-core/libs'
import { Moralis, SupportedNetworkEnum, Token } from 'palm-core/types'
import {
  FormImage,
  FormInput,
  FormText,
  Row,
} from 'palm-react-native-ui-kit/components'
import images from 'palm-ui-kit/assets/images'
import React, { Dispatch, ReactElement, SetStateAction, useMemo } from 'react'
import { Image, StyleSheet, View } from 'react-native'

import { Icon } from '@sendbird/uikit-react-native-foundation'
import { useTranslation } from 'react-i18next'

const TokenAmountInput = ({
  item,
  value,
  onSetValue,
}: {
  item: Moralis.FtItem
  value: Token | undefined
  onSetValue?: Dispatch<SetStateAction<Token>>
  selectedNetwork: SupportedNetworkEnum
}): ReactElement => {
  const { t } = useTranslation()

  const tokenValue = useMemo(
    () =>
      value
        ? UTIL.getTokenBalanceInUSD(
            UTIL.microfyP(UTIL.removeCommasToNumber(value) as Token),
            item.price
          )
        : undefined,
    [item, value]
  )

  return (
    <View>
      <Row style={styles.itemCard}>
        {item.logo ? (
          <FormImage
            source={item.logo ? { uri: item.logo } : images.palm_logo}
            size={28}
          />
        ) : (
          <Icon icon={'error'} size={24} color={COLOR.primary._300} />
        )}
        <FormText font={'B'} size={16}>
          {item.symbol}
        </FormText>
        <Image source={images.repeat} style={{ width: 20, height: 20 }} />
      </Row>
      <View style={styles.amount}>
        <FormInput
          font={'B'}
          size={24}
          placeholder="0"
          value={value}
          onChangeText={(_value): void => {
            onSetValue?.(_value as Token)
          }}
          inputMode={'decimal'}
          style={styles.amountInput}
        />
        {
          <FormText color={COLOR.black._400} style={{ opacity: value ? 1 : 0 }}>
            {t('Common.UsdPrice', {
              price: tokenValue
                ? UTIL.formatAmountP(tokenValue, { toFix: 2 })
                : '?',
            })}
          </FormText>
        }
      </View>
    </View>
  )
}

export default TokenAmountInput

const styles = StyleSheet.create({
  itemCard: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLOR.black._90005,
    borderRadius: 16,
    marginVertical: 2,
    columnGap: 8,
  },
  amount: {
    padding: 8,
  },
  amountInput: {
    borderWidth: 0,
    borderRadius: 0,
    padding: 0,
    paddingLeft: 0,
    minHeight: 48,
  },
})
