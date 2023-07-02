import { apiManager } from 'palm-core/complex/api'
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

export const getUserNfts = async ({
  selectedNetwork,
  userAddress,
  limit,
  cursor,
}: {
  selectedNetwork: SupportedNetworkEnum
  userAddress: ContractAddr
  limit?: number
  cursor?: string
}): Promise<Moralis.NftItemsFetchResult> => {
  const path = apiV1Fabricator[ApiEnum.ASSETS].get({
    userAddress,
    connectedNetworkId: chainId(selectedNetwork),
    limit,
    cursor,
  })
  const fetchResult = await apiManager.get<ApiEnum.ASSETS>({ path })

  if (fetchResult.success) {
    fetchResult.data.result = fetchResult.data.result.filter(
      x => !!x && !(UTIL.isMainnet() && x.possible_spam === true)
    )
    return fetchResult.data
  } else {
    recordError(new Error(fetchResult.errMsg), 'getUserNfts')
    return {
      page: 0,
      page_size: 0,
      cursor: null,
      result: [] as Moralis.NftItem[],
    } as Moralis.NftItemsFetchResult
  }
}
