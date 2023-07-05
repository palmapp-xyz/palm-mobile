import _ from 'lodash'
import { apiManager } from 'palm-core/complex/api'
import { getUserNativeTokenBalance } from 'palm-core/independent/nativeToken'
import apiV1Fabricator from 'palm-core/libs/apiV1Fabricator'
import { recordError } from 'palm-core/libs/logger'
import { chainId } from 'palm-core/libs/network'
import {
  ApiEnum,
  ContractAddr,
  Moralis,
  SupportedNetworkEnum,
} from 'palm-core/types'

import { UTIL } from '../libs'

export const getUserFtList = async ({
  selectedNetwork,
  userAddress,
}: {
  selectedNetwork: SupportedNetworkEnum
  userAddress: ContractAddr
}): Promise<Moralis.FtItem[]> => {
  const nativeToken: Moralis.FtItem = await getUserNativeTokenBalance(
    userAddress,
    selectedNetwork
  )

  const path = apiV1Fabricator[ApiEnum.TOKENS].get({
    userAddress,
    connectedNetworkId: chainId(selectedNetwork),
  })
  const fetchResult = await apiManager.get<ApiEnum.TOKENS>({ path })

  if (fetchResult.success) {
    return _.flatten(
      (nativeToken ? [nativeToken] : []).concat(
        fetchResult.data.result
          .filter(x => !(x.possible_spam && UTIL.isMainnet()))
          .sort((a, b) => {
            if (!a.price && !b.price) {
              return a.balance >= b.balance ? -1 : 1
            } else if (!a.price) {
              return 1
            } else if (!b.price) {
              return -1
            } else {
              return (
                -1 *
                UTIL.toBn(a.balance)
                  .multipliedBy(a.price.usdPrice)
                  .comparedTo(
                    UTIL.toBn(b.balance).multipliedBy(b.price.usdPrice)
                  )
              )
            }
          })
      )
    )
  } else {
    recordError(new Error(fetchResult.errMsg), 'getUserFtList')
    return []
  }
}
