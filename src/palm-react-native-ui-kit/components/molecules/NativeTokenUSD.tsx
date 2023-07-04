import _ from 'lodash'
import { COLOR } from 'palm-core/consts'
import { UTIL } from 'palm-core/libs'
import { Moralis, pToken, SupportedNetworkEnum } from 'palm-core/types'
import useNativeToken from 'palm-react/hooks/independent/useNativeToken'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import FormText from '../atoms/FormText'

const NativeTokenUSD = ({
  amount,
  network,
}: {
  amount: pToken
  network: SupportedNetworkEnum
}): ReactElement => {
  const { getNativeToken } = useNativeToken({ network })
  const { t } = useTranslation()

  const nativeToken: Moralis.FtItem = getNativeToken(amount || ('0' as pToken))
  const usdPrice = _.toString(nativeToken.price?.usdPrice) as pToken

  return (
    <FormText color={COLOR.black._400}>
      {t('Common.UsdPrice', {
        price: UTIL.formatAmountP(usdPrice, {
          toFix: 2,
        }),
      })}
    </FormText>
  )
}

export default NativeTokenUSD
