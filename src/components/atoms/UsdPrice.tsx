import { COLOR, UTIL } from 'consts'
import useEthPrice from 'hooks/independent/useEthPrice'
import useKlayPrice from 'hooks/independent/useKlayPrice'
import useMaticPrice from 'hooks/independent/useMaticPrice'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { pToken, SupportedNetworkEnum } from 'types'

import FormText from './FormText'

const UsdPrice = ({
  amount,
  chain,
}: {
  amount: pToken
  chain: SupportedNetworkEnum
}): ReactElement => {
  const { t } = useTranslation()
  const { getEthPrice } = useEthPrice()
  const { getKlayPrice } = useKlayPrice()
  const { getMaticPrice } = useMaticPrice()

  const getPrice = (): pToken => {
    switch (chain) {
      case SupportedNetworkEnum.ETHEREUM:
        return getEthPrice(amount || ('0' as pToken))
      case SupportedNetworkEnum.KLAYTN:
        return getKlayPrice(amount || ('0' as pToken))
      case SupportedNetworkEnum.POLYGON:
        return getMaticPrice(amount || ('0' as pToken))
    }
  }

  return (
    <FormText color={COLOR.black._400}>
      {t('Common.UsdPrice', {
        price: UTIL.formatAmountP(
          UTIL.isValidPrice(UTIL.demicrofyP(amount))
            ? getPrice()
            : ('0' as pToken),
          {
            toFix: 2,
          }
        ),
      })}
    </FormText>
  )
}

export default UsdPrice
