import { apiManager } from 'core/complex/api'
import { getUserNativeTokenBalance } from 'core/independent/nativeToken'
import apiV1Fabricator from 'core/libs/apiV1Fabricator'
import { recordError } from 'core/libs/logger'
import { chainId } from 'core/libs/network'
import {
  ApiEnum,
  ContractAddr,
  Moralis,
  SupportedNetworkEnum,
} from 'core/types'
import _ from 'lodash'

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

export const getUserCollectionNfts = async ({
  selectedNetwork,
  userAddress,
  contractAddress,
  limit,
  cursor,
}: {
  selectedNetwork: SupportedNetworkEnum
  userAddress: ContractAddr
  contractAddress: ContractAddr
  limit?: number
  cursor?: string
}): Promise<Moralis.NftItemsFetchResult> => {
  const path = apiV1Fabricator[ApiEnum.COLLECTION_ASSETS].get({
    userAddress,
    contractAddress,
    connectedNetworkId: chainId(selectedNetwork),
    limit,
    cursor,
  })
  const fetchResult = await apiManager.get<ApiEnum.COLLECTION_ASSETS>({ path })

  if (fetchResult.success) {
    return fetchResult.data
  } else {
    recordError(new Error(fetchResult.errMsg), 'useCollectionNfts')
    return {
      page: 0,
      page_size: 0,
      cursor: null,
      result: [] as Moralis.NftItem[],
    } as Moralis.NftItemsFetchResult
  }
}
